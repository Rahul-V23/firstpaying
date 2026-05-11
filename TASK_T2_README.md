# Task T2: Set Up Supabase Project and Database Schema

## 📋 Task Overview

This task sets up the Supabase database infrastructure for the FirstPaying MVP. It includes:
- Creating the `analyses` table to store user analyses
- Creating the `subscriptions` table for future Stripe integration
- Setting up indexes for performance
- Configuring Row-Level Security (RLS) policies for data privacy

## ✅ Current Status

**Completed**:
- ✅ Supabase project created
- ✅ Project URL and anon key obtained
- ✅ Credentials added to `.env.local`
- ✅ Email/password authentication enabled (default)
- ✅ SQL setup scripts created
- ✅ Documentation created
- ✅ Verification script created

**Pending**:
- ⏳ Execute SQL setup in Supabase dashboard
- ⏳ Verify tables are created
- ⏳ Run verification script

## 🚀 Quick Start (5 Minutes)

### Step 1: Execute SQL Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: `firstpaying`
3. Click **SQL Editor** → **New Query**
4. Copy all SQL from **SUPABASE_SQL_QUICK_REFERENCE.md**
5. Paste into editor and click **Run**

### Step 2: Verify Setup

```bash
npx ts-node verify-supabase-setup.ts
```

Expected output: All checks pass ✅

### Step 3: Done!

Your database is now ready. Proceed to Task T3.

---

## 📚 Documentation Files

### For Quick Setup
- **SUPABASE_SQL_QUICK_REFERENCE.md** - Copy-paste SQL commands (START HERE)
- **T2_EXECUTION_SUMMARY.md** - Overview and what to do

### For Detailed Instructions
- **SUPABASE_SETUP_GUIDE.md** - Step-by-step guide with screenshots
- **T2_SETUP_CHECKLIST.md** - Detailed acceptance criteria checklist

### For Reference
- **supabase-setup.sql** - Complete SQL script
- **verify-supabase-setup.ts** - Verification script

---

## 🗄️ Database Schema

### `analyses` Table
Stores user analyses (one per analysis request)

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Unique identifier |
| `user_id` | UUID | Reference to user |
| `input_text` | TEXT | User's input (URL or description) |
| `created_at` | TIMESTAMP | When analysis was created |

**Indexes**: `user_id`, `created_at`
**RLS**: Users can only read/insert their own analyses

### `subscriptions` Table
Stores user subscription information (for future Stripe integration)

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Unique identifier |
| `user_id` | UUID | Reference to user |
| `stripe_customer_id` | TEXT | Stripe customer ID |
| `stripe_subscription_id` | TEXT | Stripe subscription ID |
| `status` | TEXT | Subscription status |
| `created_at` | TIMESTAMP | When subscription was created |
| `updated_at` | TIMESTAMP | When subscription was last updated |

**Indexes**: `user_id`
**RLS**: Users can only read/insert their own subscription

---

## 🔐 Security Features

### Row-Level Security (RLS)
- Users can only read their own data
- Users can only insert data for themselves
- Prevents unauthorized access

### Foreign Key Constraints
- `user_id` references `auth.users.id`
- Cascade delete: Deleting a user deletes all their analyses
- Ensures data integrity

### Indexes
- Fast lookups by `user_id`
- Fast sorting by `created_at`
- Improves query performance

---

## 📋 Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Supabase project created | ✅ |
| Project URL obtained | ✅ |
| Anon key obtained | ✅ |
| Auth configured | ✅ |
| `analyses` table created | ⏳ |
| `analyses` columns correct | ⏳ |
| Foreign key constraint | ⏳ |
| Indexes created | ⏳ |
| RLS policies configured | ⏳ |
| `subscriptions` table created | ⏳ |
| Credentials in `.env.local` | ✅ |

---

## 🔧 How to Execute

### Option 1: Quick Copy-Paste (Recommended)
1. Open **SUPABASE_SQL_QUICK_REFERENCE.md**
2. Copy the SQL commands
3. Paste into Supabase SQL Editor
4. Click Run

### Option 2: Step-by-Step Guide
1. Open **SUPABASE_SETUP_GUIDE.md**
2. Follow the detailed instructions
3. Execute each step

### Option 3: Use SQL File
1. Open **supabase-setup.sql**
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click Run

---

## ✨ Verification

After executing the SQL, verify the setup:

```bash
# Run verification script
npx ts-node verify-supabase-setup.ts
```

Expected output:
```
🔍 Verifying Supabase Setup...

1️⃣  Testing connection...
   ✅ Successfully connected to Supabase

2️⃣  Checking analyses table...
   ✅ analyses table exists and is accessible

3️⃣  Checking subscriptions table...
   ✅ subscriptions table exists and is accessible

4️⃣  Checking authentication...
   ✅ Authentication is configured

✨ Setup verification complete!
```

---

## 🐛 Troubleshooting

### "relation does not exist"
**Solution**: Execute the SQL setup script in Supabase SQL Editor

### "Permission denied"
**Solution**: Make sure you're logged in as the project owner

### Verification script shows errors
**Solution**: 
1. Wait a few seconds for Supabase to process changes
2. Run the verification script again
3. Check Supabase dashboard to confirm tables exist

### Can't access SQL Editor
**Solution**: 
1. Make sure you're logged into Supabase
2. Select the correct project
3. Check that you have admin privileges

---

## 📝 Environment Variables

All required variables are already in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=[from your Supabase project]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from your Supabase project]
OPENROUTER_API_KEY=[from your OpenRouter account]
STRIPE_SECRET_KEY=
```

---

## 🎯 Next Steps

After completing this task:

1. ✅ Execute SQL setup in Supabase dashboard
2. ✅ Run verification script
3. ✅ Verify tables in Supabase dashboard
4. → **Task T3**: Initialize Next.js Project Structure

---

## 📞 Need Help?

- **Quick Setup**: See **SUPABASE_SQL_QUICK_REFERENCE.md**
- **Detailed Guide**: See **SUPABASE_SETUP_GUIDE.md**
- **Checklist**: See **T2_SETUP_CHECKLIST.md**
- **Overview**: See **T2_EXECUTION_SUMMARY.md**

---

## 📊 Task Breakdown

| Subtask | Status | Time |
|---------|--------|------|
| Verify Supabase project | ✅ | 5 min |
| Create `analyses` table | ⏳ | 2 min |
| Create `subscriptions` table | ⏳ | 2 min |
| Set up RLS policies | ⏳ | 1 min |
| Create indexes | ⏳ | 1 min |
| Test connection | ⏳ | 2 min |
| **Total** | **⏳** | **~10 min** |

---

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Indexes Guide](https://supabase.com/docs/guides/database/indexes)

---

## 📄 Files in This Task

```
.
├── TASK_T2_README.md                    (This file)
├── SUPABASE_SQL_QUICK_REFERENCE.md      (Copy-paste SQL)
├── SUPABASE_SETUP_GUIDE.md              (Step-by-step guide)
├── T2_SETUP_CHECKLIST.md                (Detailed checklist)
├── T2_EXECUTION_SUMMARY.md              (Overview)
├── supabase-setup.sql                   (Complete SQL script)
├── verify-supabase-setup.ts             (Verification script)
└── .env.local                           (Already configured)
```

---

## ✅ Completion Checklist

- [ ] Read this README
- [ ] Open SUPABASE_SQL_QUICK_REFERENCE.md
- [ ] Copy SQL commands
- [ ] Execute in Supabase SQL Editor
- [ ] Run verification script
- [ ] Verify tables in Supabase dashboard
- [ ] All checks pass ✅
- [ ] Proceed to Task T3

---

## 🎉 Summary

**What's Done**:
- ✅ Supabase project verified
- ✅ Credentials verified
- ✅ SQL scripts created
- ✅ Documentation created

**What You Need to Do**:
1. Execute SQL setup (5 minutes)
2. Run verification script (1 minute)
3. Verify in dashboard (2 minutes)

**Total Time**: ~10 minutes

**Status**: Ready for execution ✅

---

**Start with**: SUPABASE_SQL_QUICK_REFERENCE.md
