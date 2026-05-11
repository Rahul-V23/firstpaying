import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAnalysis } from '@/lib/supabase';
import { callOpenRouter } from '@/lib/openrouter';
import { checkUsageLimit } from '@/lib/usage';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body. Please provide valid JSON.' },
        { status: 400 }
      );
    }

    const { input_text } = body;

    // Validate input
    if (!input_text || typeof input_text !== 'string' || input_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a URL or product description.' },
        { status: 400 }
      );
    }

    // Extract and verify JWT token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token ? `${token.substring(0, 20)}...` : 'NULL');

    // Fix SSL certificate issue in development on Windows
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // Create Supabase client and verify token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Create an authenticated Supabase client with the user's token for RLS policies
    const authenticatedSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Check usage limit
    const usageLimit = await checkUsageLimit(userId, authenticatedSupabase);
    if (!usageLimit.canAnalyse) {
      return NextResponse.json(
        { error: 'paywall' },
        { status: 403 }
      );
    }

    // Call OpenRouter API
    let analysisOutput;
    try {
      analysisOutput = await callOpenRouter(input_text);
    } catch (error: any) {
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'Analysis failed. Please try again.' },
        { status: 500 }
      );
    }

    // Store analysis in database using authenticated client
    let analysisId;
    try {
      analysisId = await createAnalysis(userId, input_text, authenticatedSupabase);
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save analysis. Please try again.' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        conversions: analysisOutput.conversions,
        reddit: analysisOutput.reddit,
        emails: analysisOutput.emails,
        analysis_id: analysisId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Unexpected error in /api/analyse:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
