# FirstPaying Debug & Fix — Requirements

## Objective
Audit the entire FirstPaying codebase, fix all bugs, verify the complete user flow works end-to-end, and confirm the app is ready for deployment.

## Current Issues to Fix

### Issue 1: Supabase Package Version
- @supabase/supabase-js may be outdated
- Need version 2.39.0+ for new key format support

### Issue 2: lib/supabase.ts Configuration
- OPENROUTER_API_KEY incorrectly included in environment validation
- Missing proper client exports for browser components
- Missing getSupabaseBrowserClient() function

### Issue 3: app/page.tsx Auth Detection
- Auth detection is broken
- getUser() call is incorrect
- Session not properly detected on page load
- Need to use getSupabaseBrowserClient() instead

### Issue 4: components/AuthModal.tsx
- Not using correct Supabase client
- onAuthSuccess callback timing issues
- Session not confirmed before callback

### Issue 5: app/api/analyse/route.ts
- Server-side auth not properly implemented
- Not using createServerClient with cookies
- Missing usage limit check
- Missing OpenRouter fallback logic
- Missing analysis storage

### Issue 6: System Prompt Missing
- lib/openrouter.ts needs correct system prompt
- Prompt must instruct AI to return exactly three sections

### Issue 7: Database Tables Not Created
- SQL for analyses and subscriptions tables needed
- RLS policies not configured

### Issue 8: Middleware Missing
- No middleware.ts for session refresh
- Cookie handling not implemented

### Issue 9: Import Errors
- Incorrect imports across components
- getUser() used in client components instead of getSupabaseBrowserClient()

### Issue 10: End-to-End Flow Broken
- Complete user flow not working
- Auth → Analysis → Paywall flow broken

## Success Criteria

The app is considered fixed when:
- npm run dev starts without errors
- Page loads and detects logged-in user correctly
- Analyse button works for logged-in user
- OpenRouter API returns three outputs
- Outputs display on screen
- After 2 analyses, paywall modal shows
- No TypeScript errors in build
- Complete end-to-end flow verified

## Scope

Fix all 11 tasks sequentially:
1. Fix Supabase package version
2. Fix lib/supabase.ts
3. Fix app/page.tsx auth detection
4. Fix components/AuthModal.tsx
5. Fix app/api/analyse/route.ts
6. Add system prompt to lib/openrouter.ts
7. Create Supabase database tables (SQL)
8. Fix middleware.ts for session refresh
9. Verify all imports are correct
10. End-to-end flow verification
11. Final check & build verification
