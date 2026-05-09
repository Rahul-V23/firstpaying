# Supabase SQL Quick Reference

## Quick Copy-Paste SQL Commands

### 1. Create `analyses` Table (Copy & Paste This)

```sql
-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read their own analyses"
  ON analyses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Steps**:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the SQL above
4. Paste into the editor
5. Click "Run"

---

### 2. Create `subscriptions` Table (Copy & Paste This)

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

-- Create index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read their own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Steps**:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the SQL above
4. Paste into the editor
5. Click "Run"

---

### 3. Verify Setup (Copy & Paste This)

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('analyses', 'subscriptions')
ORDER BY table_name;

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename IN ('analyses', 'subscriptions')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('analyses', 'subscriptions')
ORDER BY tablename, policyname;
```

**Expected Results**:
- 2 tables: `analyses`, `subscriptions`
- 4 indexes: `idx_analyses_user_id`, `idx_analyses_created_at`, `idx_subscriptions_user_id`, plus primary key indexes
- 4 RLS policies: 2 for `analyses`, 2 for `subscriptions`

---

### 4. Check Table Structure (Copy & Paste This)

```sql
-- Check analyses table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'analyses'
ORDER BY ordinal_position;

-- Check subscriptions table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;
```

---

### 5. Test RLS Policies (Copy & Paste This)

```sql
-- This will show you the RLS policies in detail
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('analyses', 'subscriptions')
ORDER BY tablename, policyname;
```

---

### 6. Drop Tables (If You Need to Start Over)

```sql
-- WARNING: This will delete all data!
-- Only use if you need to start over

DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS analyses CASCADE;
```

---

## Common Issues & Solutions

### Issue: "relation does not exist"
**Cause**: Table hasn't been created yet
**Solution**: Run the CREATE TABLE command above

### Issue: "Permission denied"
**Cause**: You don't have admin privileges
**Solution**: Make sure you're logged in as the project owner

### Issue: "Foreign key constraint failed"
**Cause**: `auth.users` table doesn't exist
**Solution**: This shouldn't happen - Supabase creates it automatically. Contact support if it does.

### Issue: "RLS policy already exists"
**Cause**: You've run the setup script multiple times
**Solution**: This is fine - the `IF NOT EXISTS` clause prevents errors

---

## Verification Checklist

After running the SQL commands, verify:

- [ ] `analyses` table exists
- [ ] `subscriptions` table exists
- [ ] Both tables have correct columns
- [ ] Indexes are created
- [ ] RLS is enabled
- [ ] RLS policies are created
- [ ] Foreign key constraints are set up

---

## Environment Variables

Make sure `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=https://czjejieyqbqkguenklnf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XbQqbZcIggHOANvoQZzucg_-LQq5NCI
OPENROUTER_API_KEY=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
STRIPE_SECRET_KEY=
```

---

## Next Steps

1. ✅ Copy and paste the SQL commands above into Supabase SQL Editor
2. ✅ Run the verification query to confirm setup
3. ✅ Run `npx ts-node verify-supabase-setup.ts` to verify from your local environment
4. → Proceed to Task T3: Initialize Next.js Project Structure

---

## Need Help?

- See **SUPABASE_SETUP_GUIDE.md** for detailed step-by-step instructions
- See **T2_SETUP_CHECKLIST.md** for acceptance criteria
- See **T2_EXECUTION_SUMMARY.md** for overview
