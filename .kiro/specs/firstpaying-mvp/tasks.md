# FirstPaying MVP — Implementation Tasks

## Task Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1: Foundation & Setup                                     │
├─────────────────────────────────────────────────────────────────┤
│ T1: Configure environment variables                             │
│ T2: Set up Supabase project and database schema                 │
│ T3: Initialize Next.js project structure                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 2: Core Libraries & Utilities                             │
├─────────────────────────────────────────────────────────────────┤
│ T4: Create lib/supabase.ts (Supabase client)                    │
│ T5: Create lib/openrouter.ts (AI API integration)               │
│ T6: Create lib/usage.ts (Usage tracking)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 3: Backend API                                            │
├─────────────────────────────────────────────────────────────────┤
│ T7: Create /api/analyse route (POST endpoint)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 4: Frontend Components                                    │
├─────────────────────────────────────────────────────────────────┤
│ T8: Create AnalyseInput component                               │
│ T9: Create OutputSection component                              │
│ T10: Create LoadingState component                              │
│ T11: Create AuthModal component                                 │
│ T12: Create PaywallModal component                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 5: Main Page & Integration                                │
├─────────────────────────────────────────────────────────────────┤
│ T13: Create app/layout.tsx (dark theme setup)                   │
│ T14: Create app/page.tsx (main orchestration)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 6: Testing & Deployment                                   │
├─────────────────────────────────────────────────────────────────┤
│ T15: Test authentication flow (sign up, login, logout)          │
│ T16: Test analysis flow (input → API → outputs)                 │
│ T17: Test paywall enforcement (2 analyses limit)                │
│ T18: Test error handling (network, API, validation)             │
│ T19: Test responsive design (mobile, tablet, desktop)           │
│ T20: Deploy to Vercel                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation & Setup

### T1: Configure Environment Variables

**Description**: Set up all required environment variables for local development and Vercel deployment.

**Acceptance Criteria**:
- [x] `.env.local` file created with all required variables
- [x] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- [x] `OPENROUTER_API_KEY` is set (server-side only)
- [x] `STRIPE_SECRET_KEY` placeholder is added (can be empty for now)
- [x] `.env.local` is added to `.gitignore`
- [x] All variables are documented in a `.env.example` file
- [x] App fails gracefully with clear error if required variables are missing

**Subtasks**:
- Create `.env.local` with template
- Create `.env.example` with variable descriptions
- Add error handling in lib/supabase.ts to check for missing variables

**Estimated Time**: 15 minutes

---

### T2: Set Up Supabase Project and Database Schema

**Description**: Create Supabase project, configure authentication, and set up database tables.

**Acceptance Criteria**:
- [x] Supabase project created and project URL obtained
- [x] Supabase Auth configured for email/password authentication
- [x] `analyses` table created with columns: `id`, `user_id`, `input_text`, `created_at`
- [x] Foreign key constraint set up: `user_id` → `auth.users.id`
- [x] Indexes created on `user_id` and `created_at`
- [x] Row-level security (RLS) policies configured:
  - Users can only read their own analyses
  - Users can only insert analyses for themselves
- [x] `subscriptions` table created (for future use): `id`, `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `created_at`, `updated_at`
- [x] Supabase credentials (URL, anon key) obtained and added to `.env.local`

**Subtasks**:
- Create Supabase project
- Configure email/password auth
- Create `analyses` table with schema
- Create `subscriptions` table with schema
- Set up RLS policies
- Test connection from local environment

**Estimated Time**: 45 minutes

---

### T3: Initialize Next.js Project Structure

**Description**: Ensure Next.js 15 project structure is set up correctly with TypeScript and Tailwind CSS.

**Acceptance Criteria**:
- [x] Next.js 15 is installed and configured
- [x] TypeScript is configured with strict mode
- [x] Tailwind CSS is installed and configured
- [x] shadcn/ui is installed and configured
- [x] `app/` directory structure exists with `page.tsx` and `layout.tsx`
- [x] `components/` directory exists
- [x] `lib/` directory exists
- [x] `public/` directory exists
- [x] `globals.css` is set up with dark theme base styles
- [x] `package.json` has all required dependencies
- [x] `npm run dev` starts the dev server successfully
- [x] `npm run build` builds the project successfully

**Subtasks**:
- Verify Next.js 15 installation
- Configure TypeScript (tsconfig.json)
- Configure Tailwind CSS (tailwind.config.ts)
- Install shadcn/ui
- Create directory structure
- Set up globals.css with dark theme

**Estimated Time**: 30 minutes

---

## Phase 2: Core Libraries & Utilities

### T4: Create lib/supabase.ts (Supabase Client)

**Description**: Initialize Supabase client and create utility functions for authentication and database operations.

**Acceptance Criteria**:
- [x] Supabase client is initialized with environment variables
- [x] `getUser()` function returns current authenticated user or null
- [x] `getUserAnalysisCount(userId)` returns count of user's analyses
- [x] `createAnalysis(userId, inputText)` inserts analysis into database and returns analysis ID
- [x] `checkSubscriptionStatus(userId)` returns subscription status (added later, returns false for now)
- [x] Error handling for missing environment variables
- [x] Error handling for database operations (connection errors, query errors)
- [~] All functions are properly typed with TypeScript

**Subtasks**:
- Import Supabase client library
- Initialize client with environment variables
- Implement `getUser()` function
- Implement `getUserAnalysisCount()` function
- Implement `createAnalysis()` function
- Implement `checkSubscriptionStatus()` function (placeholder)
- Add error handling and logging

**Estimated Time**: 45 minutes

---

### T5: Create lib/openrouter.ts (AI API Integration)

**Description**: Implement OpenRouter API integration with system prompt and fallback logic.

**Acceptance Criteria**:
- [x] `callOpenRouter(userInput)` function accepts user input and returns three outputs
- [x] System prompt is defined and instructs AI to return three sections separated by `---`
- [x] Primary model is `meta-llama/llama-3.3-70b-instruct:free`
- [x] Fallback model is `google/gemma-4-31b-it:free`
- [x] On 429 error, automatically retries with fallback model
- [x] Response is parsed into three sections: `conversions`, `reddit`, `emails`
- [x] Error handling for API failures (non-429 errors)
- [x] Error handling for missing `OPENROUTER_API_KEY`
- [x] Timeout handling (max 30 seconds per request)
- [ ] All functions are properly typed with TypeScript

**Subtasks**:
- Define system prompt
- Implement `callOpenRouter()` function
- Implement API call with primary model
- Implement retry logic with fallback model
- Implement response parsing (split by `---`)
- Add error handling and logging
- Add timeout handling

**Estimated Time**: 60 minutes

---

### T6: Create lib/usage.ts (Usage Tracking)

**Description**: Implement usage tracking and paywall enforcement logic.

**Acceptance Criteria**:
- [x] `checkUsageLimit(userId)` returns object with `canAnalyse`, `count`, `limit`
- [x] Free tier limit is 2 analyses
- [x] `incrementUsageCount(userId)` increments analysis count in database
- [x] `checkSubscriptionStatus(userId)` is called to determine if user is paid
- [x] Paid users have unlimited analyses (no limit enforced)
- [~] Error handling for database operations
- [ ] All functions are properly typed with TypeScript

**Subtasks**:
- Implement `checkUsageLimit()` function
- Implement `incrementUsageCount()` function
- Integrate with subscription status check
- Add error handling and logging

**Estimated Time**: 30 minutes

---

## Phase 3: Backend API

### T7: Create /api/analyse Route (POST Endpoint)

**Description**: Implement the main API endpoint that orchestrates authentication, usage checking, AI analysis, and database storage.

**Acceptance Criteria**:
- [~] POST `/api/analyse` endpoint accepts `input_text` in request body
- [~] Endpoint validates user is authenticated (returns 401 if not)
- [~] Endpoint checks usage limit (returns 403 if limit reached and user is not paid)
- [~] Endpoint calls `callOpenRouter()` with user input
- [~] Endpoint stores analysis in database using `createAnalysis()`
- [~] Endpoint increments usage count using `incrementUsageCount()`
- [~] Endpoint returns three outputs: `conversions`, `reddit`, `emails`
- [~] Endpoint returns `analysis_id` for tracking
- [~] Error handling for all failure scenarios (401, 403, 500)
- [~] Error messages are user-friendly and logged server-side
- [~] Request validation (input_text is not empty)
- [~] CORS headers are set correctly (same-origin only)
- [ ] All functions are properly typed with TypeScript

**Subtasks**:
- Create `app/api/analyse/route.ts`
- Implement authentication check
- Implement usage limit check
- Implement OpenRouter API call
- Implement database storage
- Implement error handling
- Add request validation
- Add logging

**Estimated Time**: 60 minutes

---

## Phase 4: Frontend Components

### T8: Create AnalyseInput Component

**Description**: Implement the input field and submit button component.

**Acceptance Criteria**:
- [~] Component accepts props: `onSubmit(text: string)`, `isLoading: boolean`
- [~] Renders a large textarea with placeholder text
- [~] Renders green "Analyse" button below textarea
- [~] Button is disabled while `isLoading` is true
- [~] Button shows "Analysing..." text during loading
- [~] On submit, validates input is not empty
- [~] On submit, calls `onSubmit(inputText)`
- [~] Shows validation error if input is empty
- [~] Full width on mobile, constrained width on desktop
- [~] Styled with Tailwind CSS (no inline styles)
- [~] Uses shadcn/ui Button component
- [~] Responsive design tested on mobile and desktop

**Subtasks**:
- Create `components/AnalyseInput.tsx`
- Implement textarea with state management
- Implement button with loading state
- Implement input validation
- Add Tailwind CSS styling
- Test responsive design

**Estimated Time**: 30 minutes

---

### T9: Create OutputSection Component

**Description**: Implement the output card component with copy functionality.

**Acceptance Criteria**:
- [~] Component accepts props: `title: string`, `content: string | null`, `isLoading: boolean`
- [~] If `isLoading` is true, displays skeleton loader
- [~] If `content` is null and not loading, shows empty state
- [~] If `content` exists, displays content in a card
- [~] Renders "Copy" button that copies content to clipboard
- [~] Shows "Copied!" confirmation for 2 seconds after copy
- [~] Responsive: stacks vertically on mobile, side-by-side on desktop
- [~] Styled with Tailwind CSS (dark card, light text, green button)
- [ ] Uses shadcn/ui Button component
- [~] Copy functionality works in all browsers

**Subtasks**:
- Create `components/OutputSection.tsx`
- Implement skeleton loader display
- Implement content display
- Implement copy-to-clipboard functionality
- Implement "Copied!" confirmation
- Add Tailwind CSS styling
- Test copy functionality

**Estimated Time**: 40 minutes

---

### T10: Create LoadingState Component

**Description**: Implement animated skeleton loader for output cards.

**Acceptance Criteria**:
- [~] Component renders 3 animated skeleton placeholders
- [~] Each skeleton is a light gray box with shimmer animation
- [~] Animation is continuous until replaced with actual content
- [~] Styled with Tailwind CSS
- [~] Uses `animate-pulse` or custom shimmer animation
- [~] Responsive design (stacks on mobile, side-by-side on desktop)

**Subtasks**:
- Create `components/LoadingState.tsx`
- Implement 3 skeleton placeholders
- Implement shimmer animation
- Add Tailwind CSS styling
- Test animation smoothness

**Estimated Time**: 25 minutes

---

### T11: Create AuthModal Component

**Description**: Implement sign up and login modal.

**Acceptance Criteria**:
- [~] Component accepts props: `isOpen: boolean`, `onClose()`, `onAuthSuccess()`
- [~] Modal appears when `isOpen` is true
- [~] Modal has two tabs: "Sign Up" and "Log In"
- [~] Accepts email and password input
- [~] On submit, calls Supabase Auth API
- [~] On success, calls `onAuthSuccess()` and closes modal
- [~] On error, displays error message
- [~] Closes when user clicks outside modal or close button
- [~] Styled with Tailwind CSS (dark modal overlay, centered)
- [~] Uses shadcn/ui Modal, Input, Button components
- [~] Form validation (email format, password length)
- [~] Loading state during authentication

**Subtasks**:
- Create `components/AuthModal.tsx`
- Implement modal structure with tabs
- Implement email and password inputs
- Implement Supabase Auth integration
- Implement error handling
- Implement form validation
- Add Tailwind CSS styling
- Test sign up and login flows

**Estimated Time**: 60 minutes

---

### T12: Create PaywallModal Component

**Description**: Implement upgrade prompt modal.

**Acceptance Criteria**:
- [~] Component accepts props: `isOpen: boolean`, `onClose()`, `onUpgrade()`
- [ ] Modal appears when `isOpen` is true
- [~] Displays message: "You've used your 2 free analyses. Unlock unlimited for $19/month"
- [~] Renders Stripe payment button (placeholder for now)
- [~] Close button allows user to dismiss without upgrading
- [~] On upgrade click, calls `onUpgrade()` (Stripe integration added later)
- [~] Styled with Tailwind CSS (dark modal, prominent message)
- [~] Uses shadcn/ui Modal, Button components
- [~] Loading state during upgrade process

**Subtasks**:
- Create `components/PaywallModal.tsx`
- Implement modal structure
- Implement upgrade message
- Implement Stripe button placeholder
- Implement close button
- Add Tailwind CSS styling
- Test modal appearance and interactions

**Estimated Time**: 30 minutes

---

## Phase 5: Main Page & Integration

### T13: Create app/layout.tsx (Dark Theme Setup)

**Description**: Implement root layout with dark theme configuration.

**Acceptance Criteria**:
- [~] Layout wraps all pages with dark theme
- [~] Background color is #0a0a0a
- [~] Text color is #ffffff
- [~] Tailwind CSS dark mode is configured
- [~] `globals.css` is imported
- [~] Metadata is set (title, description)
- [~] Font is configured (e.g., Inter or system font)
- [~] No navigation or header elements
- [~] Responsive on all screen sizes

**Subtasks**:
- Create `app/layout.tsx`
- Configure dark theme in Tailwind
- Set up `globals.css` with base styles
- Configure metadata
- Configure font
- Test dark theme on all pages

**Estimated Time**: 20 minutes

---

### T14: Create app/page.tsx (Main Orchestration)

**Description**: Implement main page component that orchestrates all other components and manages state.

**Acceptance Criteria**:
- [~] Component manages state: `user`, `inputText`, `outputs`, `isLoading`, `showAuthModal`, `showPaywallModal`, `error`
- [~] On mount, checks if user is logged in (Supabase session)
- [~] Renders AnalyseInput component
- [~] On "Analyse" click:
  - If not logged in, shows AuthModal
  - If logged in, calls `/api/analyse` endpoint
  - Shows LoadingState while waiting
  - On success, displays three OutputSection components
  - On paywall trigger (403), shows PaywallModal
- [~] Handles logout (minimal UI, e.g., keyboard shortcut or corner button)
- [~] Error handling for all failure scenarios
- [~] Responsive design on all screen sizes
- [~] All state is managed with `useState` hooks (no external state management)

**Subtasks**:
- Create `app/page.tsx`
- Implement state management with `useState`
- Implement session check on mount
- Implement API call to `/api/analyse`
- Implement error handling
- Implement logout functionality
- Integrate all components
- Test all user flows
- Test responsive design

**Estimated Time**: 90 minutes

---

## Phase 6: Testing & Deployment

### T15: Test Authentication Flow

**Description**: Test sign up, login, and logout functionality.

**Acceptance Criteria**:
- [~] User can sign up with email and password
- [~] User can log in with email and password
- [~] User session persists across page refreshes
- [~] User can log out
- [~] Auth modal appears when user clicks "Analyse" without being logged in
- [~] Auth modal closes after successful authentication
- [~] Error messages display for invalid credentials
- [~] Error messages display for duplicate email (sign up)

**Testing Steps**:
1. Open app in browser
2. Click "Analyse" without logging in → Auth modal appears
3. Sign up with new email and password
4. Verify user is logged in
5. Refresh page → user is still logged in
6. Log out
7. Verify user is logged out
8. Log in with same credentials
9. Verify user is logged in

**Estimated Time**: 30 minutes

---

### T16: Test Analysis Flow

**Description**: Test the complete analysis flow from input to outputs.

**Acceptance Criteria**:
- [~] User can enter text in input field
- [~] User can click "Analyse" button
- [~] Loading state appears (skeleton loaders)
- [~] API call is made to `/api/analyse`
- [~] Three outputs are displayed after API response
- [~] Each output card displays correct content
- [~] Copy button works for each output
- [~] "Copied!" confirmation appears after copy
- [~] Error message displays if API fails

**Testing Steps**:
1. Log in to app
2. Enter product description in input field
3. Click "Analyse" button
4. Verify loading state appears
5. Wait for API response
6. Verify three outputs are displayed
7. Click copy button on each output
8. Verify "Copied!" confirmation appears
9. Paste content to verify it was copied correctly

**Estimated Time**: 30 minutes

---

### T17: Test Paywall Enforcement

**Description**: Test free tier limit (2 analyses) and paywall modal.

**Acceptance Criteria**:
- [~] First analysis completes successfully
- [~] Second analysis completes successfully
- [~] After 2nd analysis, paywall modal appears on next "Analyse" click
- [~] Paywall modal displays correct message
- [~] Paywall modal has upgrade button
- [~] Paywall modal has close button
- [~] User can close paywall modal without upgrading
- [~] After closing paywall, user cannot perform another analysis (paywall appears again)

**Testing Steps**:
1. Log in to app
2. Perform first analysis
3. Verify analysis completes
4. Perform second analysis
5. Verify analysis completes
6. Click "Analyse" button again
7. Verify paywall modal appears
8. Verify paywall message is correct
9. Close paywall modal
10. Click "Analyse" button again
11. Verify paywall modal appears again

**Estimated Time**: 30 minutes

---

### T18: Test Error Handling

**Description**: Test error handling for network, API, and validation errors.

**Acceptance Criteria**:
- [~] Empty input validation error displays
- [~] Network error message displays if API is unreachable
- [~] API error message displays if OpenRouter fails
- [~] Retry button appears for recoverable errors
- [~] User can retry after error
- [~] Error messages are clear and user-friendly
- [~] App does not crash on any error

**Testing Steps**:
1. Try to submit empty input → validation error appears
2. Disconnect network and try to analyse → network error appears
3. Reconnect network and retry → analysis succeeds
4. Simulate API error (mock OpenRouter failure) → error message appears
5. Verify retry button works

**Estimated Time**: 30 minutes

---

### T19: Test Responsive Design

**Description**: Test app on mobile, tablet, and desktop screens.

**Acceptance Criteria**:
- [~] App works on mobile (320px width)
- [~] App works on tablet (768px width)
- [~] App works on desktop (1024px+ width)
- [~] Input field is appropriately sized for each screen
- [~] "Analyse" button is full width on mobile
- [~] Output cards stack vertically on mobile
- [~] Output cards display side-by-side on desktop
- [~] No horizontal scrolling on any screen size
- [~] All buttons and inputs have adequate touch targets (44px+)
- [~] Text is readable on all screen sizes

**Testing Steps**:
1. Open app on mobile device (or use browser dev tools)
2. Verify layout and functionality
3. Open app on tablet
4. Verify layout and functionality
5. Open app on desktop
6. Verify layout and functionality
7. Test all interactive elements on each screen size

**Estimated Time**: 45 minutes

---

### T20: Deploy to Vercel

**Description**: Deploy the app to Vercel for public access.

**Acceptance Criteria**:
- [~] GitHub repository is created and code is pushed
- [~] Vercel project is created and connected to GitHub
- [~] Environment variables are configured in Vercel dashboard
- [~] App builds successfully on Vercel
- [~] App is accessible via public URL
- [~] All features work on deployed version
- [~] HTTPS is enabled
- [~] Custom domain is configured (optional)

**Deployment Steps**:
1. Create GitHub repository
2. Push code to GitHub
3. Create Vercel account (if needed)
4. Connect Vercel to GitHub repository
5. Configure environment variables in Vercel dashboard
6. Trigger deployment
7. Verify app is accessible via public URL
8. Test all features on deployed version
9. Configure custom domain (optional)

**Estimated Time**: 30 minutes

---

## Summary

**Total Estimated Time**: ~12-14 hours of development

**Task Breakdown by Phase**:
- Phase 1 (Foundation): 1.5 hours
- Phase 2 (Libraries): 2.25 hours
- Phase 3 (Backend): 1 hour
- Phase 4 (Components): 3.25 hours
- Phase 5 (Integration): 1.75 hours
- Phase 6 (Testing & Deployment): 2.5 hours

**Recommended Execution Order**:
1. Complete Phase 1 (setup)
2. Complete Phase 2 (libraries)
3. Complete Phase 3 (backend)
4. Complete Phase 4 (components)
5. Complete Phase 5 (integration)
6. Complete Phase 6 (testing & deployment)

**Notes**:
- Tasks within each phase can be parallelized where dependencies allow
- Testing should be done incrementally as features are completed
- Stripe integration is deferred to a later phase (placeholder in PaywallModal)
- All code should follow TypeScript strict mode and Tailwind CSS conventions
- No external state management libraries should be used (useState only)
