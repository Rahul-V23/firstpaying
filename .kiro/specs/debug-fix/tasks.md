# FirstPaying — Complete Debug & Fix Tasks

## Task Dependency Graph

```
T1: Fix Supabase Package Version
        ↓
T2: Fix lib/supabase.ts
        ↓
T3: Fix app/page.tsx Auth Detection
        ↓
T4: Fix components/AuthModal.tsx
        ↓
T5: Fix app/api/analyse/route.ts
        ↓
T6: Add System Prompt to lib/openrouter.ts
        ↓
T7: Create Supabase Database Tables
        ↓
T8: Fix middleware.ts for Session Refresh
        ↓
T9: Verify All Imports Are Correct
        ↓
T10: End-to-End Flow Verification
        ↓
T11: Final Check & Build Verification
```

---

## T1: Fix Supabase Package Version

**Description**: Check and update @supabase/supabase-js to 2.39.0 or higher.

**Acceptance Criteria**:
- [x] Check package.json for @supabase/supabase-js version
- [x] If version < 2.39.0, run: npm install @supabase/supabase-js@latest
- [x] If version < 2.39.0, run: npm install @supabase/ssr@latest
- [x] Verify node_modules has correct version

**Estimated Time**: 10 minutes

---

## T2: Fix lib/supabase.ts

**Description**: Fix Supabase client configuration and exports.

**Acceptance Criteria**:
- [x] Remove OPENROUTER_API_KEY from validateEnvironmentVariables()
- [x] validateEnvironmentVariables() only checks NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] Export supabase client: export const supabase = createClient(...)
- [x] Add getSupabaseBrowserClient() function for client components
- [x] No reference to OPENROUTER_API_KEY anywhere in file
- [x] All functions properly typed with TypeScript

**Estimated Time**: 15 minutes

---

## T3: Fix app/page.tsx Auth Detection

**Description**: Replace broken auth detection with correct implementation.

**Acceptance Criteria**:
- [x] Remove old checkAuth async function
- [x] Remove old getUser() call
- [x] Replace entire first useEffect with new implementation
- [x] Update imports: remove getUser, add getSupabaseBrowserClient
- [x] Fix handleLogout to use getSupabaseBrowserClient()
- [x] Auth state properly detected on page load
- [x] Session persists across page refreshes

**Estimated Time**: 20 minutes

---

## T4: Fix components/AuthModal.tsx

**Description**: Fix AuthModal to use correct Supabase client and session handling.

**Acceptance Criteria**:
- [x] Uses getSupabaseBrowserClient() for all auth operations
- [x] No direct supabase imports in client component
- [x] onAuthSuccess callback called AFTER session confirmed
- [x] Add supabase.auth.getSession() check after signup/login
- [x] Handles email/password signup correctly
- [x] Handles email/password login correctly
- [x] Shows clear error messages for wrong credentials
- [x] Closes modal after successful auth

**Estimated Time**: 20 minutes

---

## T5: Fix app/api/analyse/route.ts

**Description**: Fix server-side auth and API orchestration.

**Acceptance Criteria**:
- [x] Create Supabase server client using cookies (createServerClient)
- [x] Get session server-side from cookies
- [x] Return 401 if no session
- [x] Check usage count before calling OpenRouter
- [x] Return 403 with { error: 'paywall' } if limit reached
- [x] Call OpenRouter with correct headers and configuration
- [x] Implement fallback to google/gemma-4-31b-it:free on 429
- [x] Parse three output sections correctly
- [x] Save analysis to Supabase after successful response
- [x] Return { conversions, reddit, emails, analysis_id }

**Estimated Time**: 30 minutes

---

## T6: Add System Prompt to lib/openrouter.ts

**Description**: Add correct system prompt for AI analysis.

**Acceptance Criteria**:
- [x] Export SYSTEM_PROMPT constant
- [x] Prompt instructs AI to return exactly three sections
- [x] Section 1: WHY YOU'RE GETTING ZERO CONVERSIONS (5 bullet points)
- [x] Section 2: YOUR REDDIT LAUNCH POST (150-200 words)
- [x] Section 3: YOUR 3-EMAIL OUTREACH SEQUENCE (3 emails)
- [x] Prompt is used in API route

**Estimated Time**: 10 minutes

---

## T7: Create Supabase Database Tables

**Description**: Generate SQL for database tables.

**Acceptance Criteria**:
- [x] SQL creates analyses table with correct schema
- [x] SQL creates subscriptions table with correct schema
- [x] Foreign keys configured with cascade delete
- [x] RLS policies configured for both tables
- [x] Users can only read/write their own rows
- [x] SQL is ready to copy-paste into Supabase editor

**Estimated Time**: 15 minutes

---

## T8: Fix middleware.ts for Session Refresh

**Description**: Create middleware for session refresh and cookie handling.

**Acceptance Criteria**:
- [x] middleware.ts created in project root
- [x] Uses createServerClient with cookie handling
- [x] Calls supabase.auth.getUser() to refresh session
- [x] Properly sets cookies in response
- [x] Config matcher excludes static files
- [x] Middleware runs on all routes except static assets

**Estimated Time**: 15 minutes

---

## T9: Verify All Imports Are Correct

**Description**: Scan and fix all imports across the codebase.

**Acceptance Criteria**:
- [x] No getUser imports in client components
- [x] All client components use getSupabaseBrowserClient()
- [x] No direct supabase imports in client components
- [x] All imports are present and correct
- [x] No TypeScript errors from missing imports
- [x] All files properly typed

**Estimated Time**: 20 minutes

---

## T10: End-to-End Flow Verification

**Description**: Trace and verify complete user flow.

**Acceptance Criteria**:
- [x] STEP 1: Page loads and detects session correctly
- [x] STEP 2: User clicks Analyse without login → Auth modal shows
- [x] STEP 3: User signs up/logs in → Analysis proceeds
- [x] STEP 4: Logged-in user clicks Analyse → API called
- [x] STEP 5: OpenRouter returns three outputs
- [x] STEP 6: Outputs display on screen
- [x] STEP 7: After 2 analyses → Paywall modal shows
- [x] STEP 8: Error handling works for all scenarios
- [x] All steps verified and working

**Estimated Time**: 30 minutes

---

## T11: Final Check & Build Verification

**Description**: Run build and verify no errors.

**Acceptance Criteria**:
- [x] npm run build completes successfully
- [x] No TypeScript errors
- [x] No build errors
- [x] npm run dev starts without errors
- [x] App loads on localhost:3000
- [x] Summary of all files changed documented
- [x] All fixes verified and working

**Estimated Time**: 15 minutes

---

## Summary

**Total Estimated Time**: ~3-4 hours

**Execution Order**: Sequential (each task depends on previous)

**Success Criteria**:
- npm run dev starts without errors
- Page loads and detects logged-in user correctly
- Analyse button works for logged-in user
- OpenRouter API returns three outputs
- Outputs display on screen
- After 2 analyses, paywall modal shows
- No TypeScript errors in build
