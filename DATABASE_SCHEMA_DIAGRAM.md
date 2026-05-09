# FirstPaying Database Schema Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                        auth.users (Supabase)                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id (UUID, PK)                                           │   │
│  │ email (string, unique)                                  │   │
│  │ encrypted_password (string)                             │   │
│  │ created_at (timestamp)                                  │   │
│  │ updated_at (timestamp)                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▲                                     │
│                           │ (1:N)                               │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ FK: user_id
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        │                                       │
┌───────▼──────────────────────┐   ┌───────────▼──────────────────┐
│      analyses                │   │    subscriptions             │
│                              │   │                              │
│ ┌──────────────────────────┐ │   │ ┌──────────────────────────┐ │
│ │ id (UUID, PK)            │ │   │ │ id (UUID, PK)            │ │
│ │ user_id (UUID, FK) ◄─────┼─┼───┼─┤ user_id (UUID, FK) ◄─────┼─┤
│ │ input_text (TEXT)        │ │   │ │ stripe_customer_id (TEXT)│ │
│ │ created_at (TIMESTAMP)   │ │   │ │ stripe_subscription_id   │ │
│ │                          │ │   │ │ (TEXT)                   │ │
│ │ Indexes:                 │ │   │ │ status (TEXT)            │ │
│ │ - idx_analyses_user_id   │ │   │ │ created_at (TIMESTAMP)   │ │
│ │ - idx_analyses_created_at│ │   │ │ updated_at (TIMESTAMP)   │ │
│ │                          │ │   │ │                          │ │
│ │ RLS Policies:            │ │   │ │ Indexes:                 │ │
│ │ - SELECT (own only)      │ │   │ │ - idx_subscriptions_user │ │
│ │ - INSERT (own only)      │ │   │ │                          │ │
│ └──────────────────────────┘ │   │ │ RLS Policies:            │ │
│                              │   │ │ - SELECT (own only)      │ │
│                              │   │ │ - INSERT (own only)      │ │
└──────────────────────────────┘   │ └──────────────────────────┘ │
                                   │                              │
                                   └──────────────────────────────┘
```

---

## Table Definitions

### `auth.users` (Managed by Supabase Auth)

```
┌─────────────────────────────────────────────────────────┐
│ TABLE: auth.users                                       │
├─────────────────────────────────────────────────────────┤
│ Column              │ Type      │ Constraints           │
├─────────────────────┼───────────┼───────────────────────┤
│ id                  │ UUID      │ PRIMARY KEY           │
│ email               │ string    │ UNIQUE, NOT NULL      │
│ encrypted_password  │ string    │ NOT NULL              │
│ created_at          │ timestamp │ DEFAULT NOW()         │
│ updated_at          │ timestamp │ DEFAULT NOW()         │
└─────────────────────────────────────────────────────────┘
```

### `analyses` (FirstPaying)

```
┌─────────────────────────────────────────────────────────┐
│ TABLE: analyses                                         │
├─────────────────────────────────────────────────────────┤
│ Column              │ Type      │ Constraints           │
├─────────────────────┼───────────┼───────────────────────┤
│ id                  │ UUID      │ PRIMARY KEY           │
│                     │           │ DEFAULT gen_random()  │
├─────────────────────┼───────────┼───────────────────────┤
│ user_id             │ UUID      │ FOREIGN KEY           │
│                     │           │ → auth.users.id       │
│                     │           │ ON DELETE CASCADE     │
│                     │           │ NOT NULL              │
├─────────────────────┼───────────┼───────────────────────┤
│ input_text          │ TEXT      │ NOT NULL              │
├─────────────────────┼───────────┼───────────────────────┤
│ created_at          │ timestamp │ DEFAULT NOW()         │
│                     │ with tz   │                       │
└─────────────────────────────────────────────────────────┘

INDEXES:
  - idx_analyses_user_id (user_id)
  - idx_analyses_created_at (created_at)

ROW-LEVEL SECURITY:
  - SELECT: auth.uid() = user_id
  - INSERT: auth.uid() = user_id
```

### `subscriptions` (FirstPaying)

```
┌─────────────────────────────────────────────────────────┐
│ TABLE: subscriptions                                    │
├─────────────────────────────────────────────────────────┤
│ Column              │ Type      │ Constraints           │
├─────────────────────┼───────────┼───────────────────────┤
│ id                  │ UUID      │ PRIMARY KEY           │
│                     │           │ DEFAULT gen_random()  │
├─────────────────────┼───────────┼───────────────────────┤
│ user_id             │ UUID      │ FOREIGN KEY           │
│                     │           │ → auth.users.id       │
│                     │           │ ON DELETE CASCADE     │
│                     │           │ NOT NULL              │
├─────────────────────┼───────────┼───────────────────────┤
│ stripe_customer_id  │ TEXT      │ nullable              │
├─────────────────────┼───────────┼───────────────────────┤
│ stripe_subscription │ TEXT      │ nullable              │
│ _id                 │           │                       │
├─────────────────────┼───────────┼───────────────────────┤
│ status              │ TEXT      │ DEFAULT 'active'      │
│                     │           │ CHECK (status IN      │
│                     │           │ 'active',             │
│                     │           │ 'cancelled',          │
│                     │           │ 'past_due')           │
├─────────────────────┼───────────┼───────────────────────┤
│ created_at          │ timestamp │ DEFAULT NOW()         │
│                     │ with tz   │                       │
├─────────────────────┼───────────┼───────────────────────┤
│ updated_at          │ timestamp │ DEFAULT NOW()         │
│                     │ with tz   │                       │
└─────────────────────────────────────────────────────────┘

INDEXES:
  - idx_subscriptions_user_id (user_id)

ROW-LEVEL SECURITY:
  - SELECT: auth.uid() = user_id
  - INSERT: auth.uid() = user_id
```

---

## Data Flow Diagram

### User Analysis Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User submits analysis request                            │
│    - Input: URL or product description                      │
│    - User must be authenticated                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. API validates user and checks usage limit                │
│    - Check: user_id exists in auth.users                    │
│    - Check: count(analyses) < 2 OR user has subscription    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API calls OpenRouter AI                                  │
│    - Input: user's input_text                               │
│    - Output: 3 analysis sections                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. API stores analysis in database                          │
│    - INSERT into analyses table                             │
│    - Columns: id, user_id, input_text, created_at           │
│    - RLS ensures user can only insert their own data        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. API returns 3 outputs to client                          │
│    - Output 1: Landing page weaknesses                      │
│    - Output 2: Reddit launch post                           │
│    - Output 3: Cold outreach emails                         │
└─────────────────────────────────────────────────────────────┘
```

### Paywall Enforcement Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User completes analysis                                  │
│    - Analysis is stored in database                         │
│    - User now has 1 analysis                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User completes second analysis                           │
│    - Analysis is stored in database                         │
│    - User now has 2 analyses                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User attempts third analysis                             │
│    - API checks: count(analyses WHERE user_id = X) >= 2     │
│    - API checks: subscriptions.status = 'active'            │
│    - Result: User is not paid → Return 403 Forbidden        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Client shows paywall modal                               │
│    - Message: "You've used your 2 free analyses"            │
│    - Button: "Upgrade for $19/month"                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. User upgrades (Stripe integration)                       │
│    - INSERT into subscriptions table                        │
│    - Columns: id, user_id, stripe_customer_id, etc.         │
│    - status = 'active'                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. User can now perform unlimited analyses                  │
│    - API checks: subscriptions.status = 'active'            │
│    - Result: User is paid → Allow analysis                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Query Examples

### Get User's Analyses

```sql
SELECT * FROM analyses
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

**Uses Index**: `idx_analyses_user_id` for fast lookup

### Count User's Analyses

```sql
SELECT COUNT(*) FROM analyses
WHERE user_id = 'user-uuid-here';
```

**Uses Index**: `idx_analyses_user_id` for fast count

### Get User's Subscription

```sql
SELECT * FROM subscriptions
WHERE user_id = 'user-uuid-here'
LIMIT 1;
```

**Uses Index**: `idx_subscriptions_user_id` for fast lookup

### Check if User is Paid

```sql
SELECT status FROM subscriptions
WHERE user_id = 'user-uuid-here'
AND status = 'active'
LIMIT 1;
```

**Uses Index**: `idx_subscriptions_user_id` for fast lookup

### Get Recent Analyses

```sql
SELECT * FROM analyses
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC
LIMIT 10;
```

**Uses Indexes**: `idx_analyses_user_id` and `idx_analyses_created_at`

---

## Security Model

### Row-Level Security (RLS)

```
┌─────────────────────────────────────────────────────────┐
│ User A (UUID: aaa-aaa-aaa)                              │
│                                                         │
│ Can READ:                                               │
│ - analyses WHERE user_id = 'aaa-aaa-aaa'                │
│ - subscriptions WHERE user_id = 'aaa-aaa-aaa'           │
│                                                         │
│ Can INSERT:                                             │
│ - analyses WITH user_id = 'aaa-aaa-aaa'                 │
│ - subscriptions WITH user_id = 'aaa-aaa-aaa'            │
│                                                         │
│ Cannot READ:                                            │
│ - analyses WHERE user_id = 'bbb-bbb-bbb' (Other user)   │
│ - subscriptions WHERE user_id = 'bbb-bbb-bbb'           │
│                                                         │
│ Cannot INSERT:                                          │
│ - analyses WITH user_id = 'bbb-bbb-bbb' (Other user)    │
│ - subscriptions WITH user_id = 'bbb-bbb-bbb'            │
└─────────────────────────────────────────────────────────┘
```

### Foreign Key Constraints

```
┌─────────────────────────────────────────────────────────┐
│ When a user is deleted from auth.users:                 │
│                                                         │
│ 1. All analyses WHERE user_id = deleted_user_id         │
│    are automatically deleted (CASCADE)                  │
│                                                         │
│ 2. All subscriptions WHERE user_id = deleted_user_id    │
│    are automatically deleted (CASCADE)                  │
│                                                         │
│ This ensures referential integrity and prevents         │
│ orphaned records.                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Indexes

```
┌─────────────────────────────────────────────────────────┐
│ analyses table                                          │
├─────────────────────────────────────────────────────────┤
│ Index: idx_analyses_user_id                             │
│ - Column: user_id                                       │
│ - Use: Fast lookup of user's analyses                   │
│ - Query: SELECT * FROM analyses WHERE user_id = X       │
│                                                         │
│ Index: idx_analyses_created_at                          │
│ - Column: created_at                                    │
│ - Use: Fast sorting by date                             │
│ - Query: SELECT * FROM analyses ORDER BY created_at     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ subscriptions table                                     │
├─────────────────────────────────────────────────────────┤
│ Index: idx_subscriptions_user_id                        │
│ - Column: user_id                                       │
│ - Use: Fast lookup of user's subscription               │
│ - Query: SELECT * FROM subscriptions WHERE user_id = X  │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

- **2 Tables**: `analyses`, `subscriptions`
- **2 Foreign Keys**: Both reference `auth.users.id`
- **3 Indexes**: For fast lookups and sorting
- **4 RLS Policies**: 2 per table for data privacy
- **Cascade Delete**: Maintains referential integrity
- **Status Enum**: Ensures valid subscription statuses

This schema ensures:
- ✅ Data privacy (RLS policies)
- ✅ Data integrity (foreign keys)
- ✅ Query performance (indexes)
- ✅ Referential integrity (cascade delete)
