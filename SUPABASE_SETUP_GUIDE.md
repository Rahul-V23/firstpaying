# Supabase Setup Guide for FirstPaying MVP

This guide walks through setting up the Supabase project with all required tables, indexes, and Row-Level Security (RLS) policies.

## Prerequisites

- Supabase project already created (URL and anon key in `.env.local`)
- Access to Supabase dashboard
- Email/password authentication already enabled (default in Supabase)

## Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `firstpaying`
3. In the left sidebar, click **SQL Editor**
4. Click **New Query** to create a new SQL query

## Step 2: Create the `analyses` Table

Copy and paste the following SQL into the SQL editor:

```sql
-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

-- Enable RLS on analyses table
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own analyses
CREATE POLICY "Users can read their own analyses"
  ON analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert analyses for themselves
CREATE POLICY "Users can insert their own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

Click **Run** to execute the query.

**Expected Result**: Query executed successfully. The `analyses` table is now created with:
- Columns: `id` (UUID), `user_id` (UUID), `input_text` (TEXT), `created_at` (TIMESTAMP)
- Foreign key constraint: `user_id` → `auth.users.id`
- Indexes on `user_id` and `created_at`
- RLS policies for read and insert operations

## Step 3: Create the `subscriptions` Table

Click **New Query** again and paste:

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own subscription
CREATE POLICY "Users can read their own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert their own subscription
CREATE POLICY "Users can insert their own subscription"
  ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

Click **Run** to execute the query.

**Expected Result**: Query executed successfully. The `subscriptions` table is now created with:
- Columns: `id`, `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `created_at`, `updated_at`
- Foreign key constraint: `user_id` → `auth.users.id`
- Index on `user_id`
- RLS policies for read and insert operations

## Step 4: Verify Tables and Policies

Click **New Query** and paste:

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('analyses', 'subscriptions');

-- Verify indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename IN ('analyses', 'subscriptions');

-- Verify RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('analyses', 'subscriptions');
```

Click **Run** to verify everything is set up correctly.

**Expected Result**: 
- 2 tables: `analyses`, `subscriptions`
- 4 indexes: `idx_analyses_user_id`, `idx_analyses_created_at`, `idx_subscriptions_user_id`, and primary key indexes
- 4 RLS policies: 2 for `analyses`, 2 for `subscriptions`

## Step 5: Verify Authentication is Enabled

1. In the left sidebar, click **Authentication**
2. Click **Providers**
3. Verify that **Email** provider is enabled (it should be by default)
4. If not enabled, click the toggle to enable it

## Step 6: Test Connection from Local Environment

In your Next.js project, create a test file to verify the connection:

```typescript
// lib/test-connection.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function testConnection() {
  try {
    // Test 1: Check if we can query the analyses table
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error querying analyses table:', error)
      return false
    }

    console.log('✓ Successfully connected to Supabase')
    console.log('✓ analyses table is accessible')
    return true
  } catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
}
```

Run this test:
```bash
node -e "import('./lib/test-connection.ts').then(m => m.testConnection())"
```

## Troubleshooting

### Issue: "Permission denied" when creating tables

**Solution**: Make sure you're logged in as the project owner or have admin privileges in Supabase.

### Issue: "Foreign key constraint failed"

**Solution**: Make sure the `auth.users` table exists (it's created automatically by Supabase Auth).

### Issue: "RLS policy already exists"

**Solution**: This is normal if you've run the setup script multiple times. The `IF NOT EXISTS` clauses prevent errors.

### Issue: Tables not visible in Table Editor

**Solution**: 
1. Refresh the Supabase dashboard
2. Make sure RLS is enabled (it should be after running the setup)
3. Check that you're viewing the correct schema (should be `public`)

## Environment Variables

Verify that `.env.local` contains:

```
NEXT_PUBLIC_SUPABASE_URL=[from your Supabase project]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from your Supabase project]
OPENROUTER_API_KEY=[from your OpenRouter account]
STRIPE_SECRET_KEY=
```

## Next Steps

After completing this setup:

1. **T3**: Initialize Next.js project structure
2. **T4**: Create `lib/supabase.ts` (Supabase client)
3. **T5**: Create `lib/openrouter.ts` (AI API integration)
4. **T6**: Create `lib/usage.ts` (Usage tracking)
5. **T7**: Create `/api/analyse` route

## Database Schema Summary

### analyses table
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Reference to auth.users.id
- `input_text` (TEXT): User's input (URL or product description)
- `created_at` (TIMESTAMP): When the analysis was created

**Indexes**: `user_id`, `created_at`

**RLS Policies**:
- SELECT: Users can only read their own analyses
- INSERT: Users can only insert analyses for themselves

### subscriptions table
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Reference to auth.users.id
- `stripe_customer_id` (TEXT): Stripe customer ID
- `stripe_subscription_id` (TEXT): Stripe subscription ID
- `status` (TEXT): Subscription status (active, cancelled, past_due)
- `created_at` (TIMESTAMP): When the subscription was created
- `updated_at` (TIMESTAMP): When the subscription was last updated

**Indexes**: `user_id`

**RLS Policies**:
- SELECT: Users can only read their own subscription
- INSERT: Users can only insert their own subscription

## Security Notes

- All tables have RLS enabled to ensure users can only access their own data
- Foreign key constraints ensure referential integrity
- Indexes on `user_id` and `created_at` optimize query performance
- The `auth.users` table is managed by Supabase Auth and cannot be modified directly
