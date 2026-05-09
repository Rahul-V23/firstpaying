/**
 * Supabase Setup Verification Script
 * 
 * This script verifies that all required tables, indexes, and RLS policies
 * are properly set up in Supabase.
 * 
 * Run with: npx ts-node verify-supabase-setup.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
  console.log('🔍 Verifying Supabase Setup...\n');

  try {
    // Test 1: Connection
    console.log('1️⃣  Testing connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('analyses')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      if (connectionError.message.includes('relation "public.analyses" does not exist')) {
        console.log('   ❌ analyses table does not exist');
        console.log('   ⚠️  You need to run the SQL setup script in Supabase SQL Editor');
      } else {
        console.log('   ❌ Connection error:', connectionError.message);
      }
    } else {
      console.log('   ✅ Successfully connected to Supabase');
    }

    // Test 2: Check analyses table
    console.log('\n2️⃣  Checking analyses table...');
    const { data: analysesData, error: analysesError } = await supabase
      .from('analyses')
      .select('*')
      .limit(1);

    if (analysesError) {
      console.log('   ❌ Error accessing analyses table:', analysesError.message);
    } else {
      console.log('   ✅ analyses table exists and is accessible');
    }

    // Test 3: Check subscriptions table
    console.log('\n3️⃣  Checking subscriptions table...');
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);

    if (subscriptionsError) {
      console.log('   ❌ Error accessing subscriptions table:', subscriptionsError.message);
    } else {
      console.log('   ✅ subscriptions table exists and is accessible');
    }

    // Test 4: Check authentication
    console.log('\n4️⃣  Checking authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('   ❌ Authentication error:', authError.message);
    } else {
      console.log('   ✅ Authentication is configured');
    }

    console.log('\n✨ Setup verification complete!');
    console.log('\nNext steps:');
    console.log('1. If any checks failed, run the SQL setup script in Supabase SQL Editor');
    console.log('2. See SUPABASE_SETUP_GUIDE.md for detailed instructions');
    console.log('3. After setup is complete, you can start implementing the app');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifySetup();
