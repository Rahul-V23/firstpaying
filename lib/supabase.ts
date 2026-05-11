import { createClient } from '@supabase/supabase-js';

// Validate required environment variables on app startup
function validateEnvironmentVariables() {
  const requiredVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env.local file and ensure all variables are set. ` +
      `See .env.example for reference.`
    );
  }
}

// Validate on module load
validateEnvironmentVariables();

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Singleton Supabase client for use in client components
 * Ensures only one client instance is created
 */
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}

// Type definitions
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  input_text: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'cancelled' | 'past_due';
  created_at: string;
  updated_at: string;
}

/**
 * Get the current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      created_at: user.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

/**
 * Get the count of analyses for a user
 * @param userId - The user's ID
 * @param client - Optional authenticated Supabase client (for server-side use with RLS)
 * @returns Count of analyses
 */
export async function getUserAnalysisCount(
  userId: string,
  client?: any
): Promise<number> {
  try {
    const supabaseClient = client || supabase;
    const { count, error } = await supabaseClient
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting analysis count:', error);
      throw new Error(`Failed to get analysis count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Unexpected error getting analysis count:', error);
    throw error;
  }
}

/**
 * Create a new analysis record
 * @param userId - The user's ID
 * @param inputText - The input text for analysis
 * @param client - Optional authenticated Supabase client (for server-side use with RLS)
 * @returns The created analysis ID
 */
export async function createAnalysis(
  userId: string,
  inputText: string,
  client?: any
): Promise<string> {
  try {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('analyses')
      .insert([
        {
          user_id: userId,
          input_text: inputText,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating analysis:', error);
      throw new Error(`Failed to create analysis: ${error.message}`);
    }

    if (!data || !data.id) {
      throw new Error('No analysis ID returned from database');
    }

    return data.id;
  } catch (error) {
    console.error('Unexpected error creating analysis:', error);
    throw error;
  }
}

/**
 * Check subscription status for a user
 * @param userId - The user's ID
 * @param client - Optional authenticated Supabase client (for server-side use with RLS)
 * @returns true if user has active subscription, false otherwise
 */
export async function checkSubscriptionStatus(
  userId: string,
  client?: any
): Promise<boolean> {
  try {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      // No subscription found is not an error, just return false
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('Error checking subscription status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking subscription status:', error);
    return false;
  }
}

export { validateEnvironmentVariables };
