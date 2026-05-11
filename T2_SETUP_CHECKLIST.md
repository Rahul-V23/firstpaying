# Task T2: Set Up Supabase Project and Database Schema - Checklist

## Task Overview
Create Supabase project, configure authentication, and set up database tables with proper schema, indexes, and Row-Level Security (RLS) policies.

## Acceptance Criteria Checklist

### ✅ Supabase Project Created and Credentials Obtained
- [x] Supabase project created
- [x] Project URL obtained: `https://czjejieyqbqkguenklnf.supabase.co`
- [x] Anon key obtained: `sb_publishable_XbQqbZcIggHOANvoQZzucg_-LQq5NCI`
- [x] Credentials added to `.env.local`

**Status**: ✅ COMPLETE

---

### ✅ Supabase Auth Configured for Email/Password Authentication
- [x] Email/password authentication enabled (default in Supabase)
- [x] Auth provider verified in Supabase dashboard

**Status**: ✅ COMPLETE (Default in Supabase)

---

### ⏳ `analyses` Table Created with Proper Schema

**Required Columns**:
- [ ] `id` (UUID, Primary Key, auto-generated)
- [ ] `user_id` (UUID, Foreign Key → `auth.users.id`)
- [ ] `input_text` (TEXT, stores user input)
- [ ] `created_at` (TIMESTAMP, auto-set to current time)

**SQL to Execute**:
```sql
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Status**: ⏳ PENDING - Execute in Supabase SQL Editor

---

### ⏳ Foreign Key Constraint Set Up

**Requirement**: `user_id` → `auth.users.id` with CASCADE delete

**SQL to Execute**:
```sql
ALTER TABLE analyses 
ADD CONSTRAINT fk_analyses_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

**Note**: This is included in the CREATE TABLE statement above.

**Status**: ⏳ PENDING - Included in table creation

---

### ⏳ Indexes Created on `user_id` and `created_at`

**Required Indexes**:
- [ ] Index on `user_id` (for fast user analysis lookups)
- [ ] Index on `created_at` (for sorting by date)

**SQL to Execute**:
```sql
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);
```

**Status**: ⏳ PENDING - Execute in Supabase SQL Editor

---

### ⏳ Row-Level Security (RLS) Policies Configured

**Policy 1: Users can only read their own analyses**
```sql
CREATE POLICY "Users can read their own analyses"
  ON analyses
  FOR SELECT
  USING (auth.uid() = user_id);
```

**Policy 2: Users can only insert analyses for themselves**
```sql
CREATE POLICY "Users can insert their own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Enable RLS**:
```sql
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
```

**Status**: ⏳ PENDING - Execute in Supabase SQL Editor

---

### ⏳ `subscriptions` Table Created (for Future Use)

**Required Columns**:
- [ ] `id` (UUID, Primary Key, auto-generated)
- [ ] `user_id` (UUID, Foreign Key → `auth.users.id`)
- [ ] `stripe_customer_id` (TEXT, Stripe customer ID)
- [ ] `stripe_subscription_id` (TEXT, Stripe subscription ID)
- [ ] `status` (TEXT, enum: active, cancelled, past_due)
- [ ] `created_at` (TIMESTAMP, auto-set to current time)
- [ ] `updated_at` (TIMESTAMP, auto-set to current time)

**SQL to Execute**:
```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Status**: ⏳ PENDING - Execute in Supabase SQL Editor

---

### ⏳ Supabase Credentials Added to `.env.local`

**Current Status**:
```
NEXT_PUBLIC_SUPABASE_URL=[from your Supabase project] ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from your Supabase project] ✅
OPENROUTER_API_KEY=[from your OpenRouter account] ✅
STRIPE_SECRET_KEY= (empty, will be added later)
```

**Status**: ✅ COMPLETE

---

## Subtasks

### Subtask 1: Verify Supabase Project is Created and Credentials are in `.env.local`
- [x] Supabase project created
- [x] Project URL verified
- [x] Anon key verified
- [x] Credentials in `.env.local`

**Status**: ✅ COMPLETE

---

### Subtask 2: Create `analyses` Table with Proper Schema
- [ ] Execute CREATE TABLE statement in Supabase SQL Editor
- [ ] Verify table appears in Supabase Table Editor
- [ ] Verify columns are correct (id, user_id, input_text, created_at)
- [ ] Verify foreign key constraint is set up

**Status**: ⏳ PENDING

**How to Execute**:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy and paste the SQL from `supabase-setup.sql` (analyses table section)
4. Click "Run"
5. Verify success message

---

### Subtask 3: Create `subscriptions` Table with Proper Schema
- [ ] Execute CREATE TABLE statement in Supabase SQL Editor
- [ ] Verify table appears in Supabase Table Editor
- [ ] Verify columns are correct (id, user_id, stripe_customer_id, stripe_subscription_id, status, created_at, updated_at)
- [ ] Verify foreign key constraint is set up

**Status**: ⏳ PENDING

**How to Execute**:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy and paste the SQL from `supabase-setup.sql` (subscriptions table section)
4. Click "Run"
5. Verify success message

---

### Subtask 4: Set Up RLS Policies for `analyses` Table
- [ ] Enable RLS on `analyses` table
- [ ] Create SELECT policy (users can read their own analyses)
- [ ] Create INSERT policy (users can insert their own analyses)
- [ ] Verify policies appear in Supabase dashboard

**Status**: ⏳ PENDING

**How to Execute**:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy and paste the RLS policy SQL from `supabase-setup.sql`
4. Click "Run"
5. Verify success message

---

### Subtask 5: Create Indexes on `user_id` and `created_at`
- [ ] Create index on `analyses.user_id`
- [ ] Create index on `analyses.created_at`
- [ ] Create index on `subscriptions.user_id`
- [ ] Verify indexes appear in Supabase dashboard

**Status**: ⏳ PENDING

**How to Execute**:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy and paste the CREATE INDEX statements from `supabase-setup.sql`
4. Click "Run"
5. Verify success message

---

### Subtask 6: Test Connection from Local Environment
- [ ] Run verification script: `npx ts-node verify-supabase-setup.ts`
- [ ] Verify all checks pass
- [ ] Verify tables are accessible from local environment

**Status**: ⏳ PENDING

**How to Execute**:
1. Open terminal in project root
2. Run: `npx ts-node verify-supabase-setup.ts`
3. Verify all checks pass (✅)

---

## Files Created

1. **supabase-setup.sql** - Complete SQL script for all table creation, indexes, and RLS policies
2. **SUPABASE_SETUP_GUIDE.md** - Step-by-step guide for executing the setup in Supabase dashboard
3. **verify-supabase-setup.ts** - Verification script to test the setup
4. **T2_SETUP_CHECKLIST.md** - This checklist document

---

## Next Steps

After completing this task:

1. Execute the SQL scripts in Supabase SQL Editor (see SUPABASE_SETUP_GUIDE.md)
2. Run the verification script to confirm setup is complete
3. Proceed to Task T3: Initialize Next.js Project Structure

---

## Important Notes

- **Email/Password Auth**: Already enabled by default in Supabase. No additional configuration needed.
- **RLS Policies**: Critical for security. Users can only access their own data.
- **Indexes**: Improve query performance for common lookups (user_id, created_at).
- **Foreign Keys**: Ensure referential integrity. Analyses are tied to users.
- **Cascade Delete**: When a user is deleted, all their analyses are automatically deleted.

---

## Troubleshooting

### Issue: "relation "public.analyses" does not exist"
**Solution**: Run the SQL setup script in Supabase SQL Editor to create the table.

### Issue: "Permission denied" when creating tables
**Solution**: Make sure you're logged in as the project owner in Supabase.

### Issue: "Foreign key constraint failed"
**Solution**: Make sure the `auth.users` table exists (it's created automatically by Supabase Auth).

### Issue: RLS policies not working
**Solution**: Make sure RLS is enabled on the table with `ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;`

---

## Verification Checklist

After completing all subtasks, verify:

- [ ] `analyses` table exists with correct columns
- [ ] `subscriptions` table exists with correct columns
- [ ] Foreign key constraints are set up
- [ ] Indexes are created on `user_id` and `created_at`
- [ ] RLS policies are configured
- [ ] Verification script passes all checks
- [ ] Can query tables from local environment
- [ ] `.env.local` has all required credentials

---

## Summary

**Task Status**: ⏳ IN PROGRESS

**Completed**:
- ✅ Supabase project created
- ✅ Credentials obtained and added to `.env.local`
- ✅ Auth configured (default)

**Pending**:
- ⏳ Execute SQL setup script in Supabase SQL Editor
- ⏳ Verify tables and policies are created
- ⏳ Run verification script

**Estimated Time to Complete**: 30-45 minutes (mostly manual steps in Supabase dashboard)
