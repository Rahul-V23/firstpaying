# FirstPaying MVP — Technical Design

## High-Level Architecture

FirstPaying is a single-page Next.js 15 application with a minimal frontend and serverless backend. The architecture follows a client-server model:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js 15 App Router (Single Page)                 │   │
│  │  - AnalyseInput component (text area + button)       │   │
│  │  - OutputSection components (3 cards)                │   │
│  │  - AuthModal (sign up / login)                        │   │
│  │  - PaywallModal (upgrade prompt)                      │   │
│  │  - LoadingState (skeleton loaders)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP POST)
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Route (Backend)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/analyse (POST)                                 │   │
│  │  - Validate user authentication                      │   │
│  │  - Check usage count (paywall enforcement)           │   │
│  │  - Call OpenRouter API                               │   │
│  │  - Store analysis in Supabase                         │   │
│  │  - Return 3 outputs to client                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↓ (Supabase Auth)    ↓ (OpenRouter API)
    ┌─────────────┐          ┌──────────────────┐
    │  Supabase   │          │  OpenRouter API  │
    │  - Auth     │          │  - Llama 3.3 70B │
    │  - Database │          │  - Gemma 4 31B   │
    │  (analyses) │          │  (fallback)      │
    └─────────────┘          └──────────────────┘
```

---

## System Components

### 1. Frontend Components

#### **AnalyseInput.tsx**
- **Purpose**: Captures user input (URL or product description)
- **Props**: `onSubmit(text: string)`, `isLoading: boolean`
- **State**: `inputText: string`
- **Behavior**:
  - Renders a large textarea with placeholder text
  - Renders green "Analyse" button below
  - Button is disabled while `isLoading` is true
  - Button shows "Analysing..." text during loading
  - On submit, validates input is not empty, then calls `onSubmit`
  - Full width on mobile, constrained width on desktop
- **Error Handling**: Shows validation error if input is empty

#### **OutputSection.tsx**
- **Purpose**: Displays one of the three AI outputs with copy functionality
- **Props**: `title: string`, `content: string | null`, `isLoading: boolean`
- **Behavior**:
  - If `isLoading` is true, displays skeleton loader (animated placeholder)
  - If `content` is null and not loading, shows empty state
  - If `content` exists, displays the content in a card
  - Renders a "Copy" button that copies content to clipboard
  - Shows "Copied!" confirmation for 2 seconds after copy
  - Responsive: stacks vertically on mobile, side-by-side on desktop
- **Styling**: Dark card with light text, green copy button

#### **AuthModal.tsx**
- **Purpose**: Handles sign up and login flows
- **Props**: `isOpen: boolean`, `onClose()`, `onAuthSuccess()`
- **State**: `email: string`, `password: string`, `isSignUp: boolean`, `error: string`, `isLoading: boolean`
- **Behavior**:
  - Modal appears when user clicks "Analyse" without being logged in
  - Two tabs: "Sign Up" and "Log In"
  - Accepts email and password input
  - On submit, calls Supabase Auth API
  - On success, calls `onAuthSuccess()` and closes modal
  - On error, displays error message
  - Closes when user clicks outside modal or close button
- **Styling**: Dark modal overlay, centered on screen

#### **PaywallModal.tsx**
- **Purpose**: Shows upgrade prompt after 2 free analyses
- **Props**: `isOpen: boolean`, `onClose()`, `onUpgrade()`
- **State**: `isLoading: boolean` (for Stripe button)
- **Behavior**:
  - Modal appears after user completes 2nd analysis
  - Displays message: "You've used your 2 free analyses. Unlock unlimited for $19/month"
  - Renders Stripe payment button (placeholder for now)
  - Close button allows user to dismiss without upgrading
  - On upgrade, calls `onUpgrade()` (Stripe integration added later)
- **Styling**: Dark modal, prominent upgrade message

#### **LoadingState.tsx**
- **Purpose**: Animated skeleton loader for output cards
- **Props**: None (or `count: number` for multiple loaders)
- **Behavior**:
  - Renders 3 animated skeleton placeholders (one per output card)
  - Each skeleton is a light gray box with shimmer animation
  - Animates continuously until replaced with actual content
- **Styling**: Tailwind CSS with `animate-pulse` or custom shimmer animation

#### **page.tsx (Main Page)**
- **Purpose**: Root component orchestrating the entire app
- **State**:
  - `user: User | null` (authenticated user)
  - `inputText: string` (user's input)
  - `outputs: { conversions: string, reddit: string, emails: string } | null`
  - `isLoading: boolean` (during API call)
  - `showAuthModal: boolean`
  - `showPaywallModal: boolean`
  - `error: string | null`
- **Behavior**:
  - On mount, check if user is logged in (Supabase session)
  - Render AnalyseInput component
  - On "Analyse" click:
    - If not logged in, show AuthModal
    - If logged in, call `/api/analyse` endpoint
    - Show LoadingState while waiting
    - On success, display three OutputSection components
    - On paywall trigger, show PaywallModal
  - Handle logout (minimal UI, e.g., keyboard shortcut or corner button)

---

### 2. Backend API Route

#### **/api/analyse (POST)**

**Request Body:**
```typescript
{
  input_text: string  // URL or product description
}
```

**Response (Success):**
```typescript
{
  conversions: string,      // 5 reasons landing page isn't converting
  reddit: string,           // Reddit launch post
  emails: string,           // 3-email cold outreach sequence
  analysis_id: string       // ID of stored analysis
}
```

**Response (Error):**
```typescript
{
  error: string  // Error message
}
```

**Logic Flow:**
1. Extract user from request (Supabase session)
2. If no user, return 401 Unauthorized
3. Check user's analysis count in Supabase `analyses` table
4. If count >= 2 and user is not paid, return 403 with paywall signal
5. Call OpenRouter API with system prompt and user input
6. If 429 error, retry with fallback model
7. Parse response into three sections (conversions, reddit, emails)
8. Store analysis in Supabase `analyses` table
9. Increment user's analysis count
10. Return three outputs to client

**Error Handling:**
- 401: User not authenticated
- 403: Free tier limit reached
- 500: OpenRouter API failure or database error
- Retry logic for 429 (rate limit)

---

### 3. Database Schema (Supabase)

#### **users table** (managed by Supabase Auth)
```sql
id (UUID, primary key)
email (string, unique)
encrypted_password (string)
created_at (timestamp)
updated_at (timestamp)
```

#### **analyses table**
```sql
id (UUID, primary key)
user_id (UUID, foreign key → users.id)
input_text (text)
created_at (timestamp)
```

**Indexes:**
- `user_id` (for fast lookup of user's analyses)
- `created_at` (for sorting by date)

#### **subscriptions table** (for paid users, added later)
```sql
id (UUID, primary key)
user_id (UUID, foreign key → users.id)
stripe_customer_id (string)
stripe_subscription_id (string)
status (enum: active, cancelled, past_due)
created_at (timestamp)
updated_at (timestamp)
```

---

### 4. Library Modules

#### **lib/supabase.ts**
- **Purpose**: Supabase client initialization and utilities
- **Exports**:
  - `supabase`: Supabase client instance
  - `getUser()`: Get current authenticated user
  - `getUserAnalysisCount(userId)`: Count user's analyses
  - `createAnalysis(userId, inputText)`: Store analysis in DB
  - `checkSubscriptionStatus(userId)`: Check if user is paid (added later)

#### **lib/openrouter.ts**
- **Purpose**: OpenRouter API integration
- **Exports**:
  - `callOpenRouter(userInput)`: Call AI API with fallback logic
  - System prompt (hardcoded in this file)
- **System Prompt**:
  ```
  You are an expert growth consultant for indie hackers and solo founders.
  
  Analyze the provided landing page URL or product description and return exactly three sections:
  
  1. LANDING PAGE WEAKNESSES (5 bullet points)
  - Identify 5 specific reasons why this landing page isn't converting visitors
  - Be direct and actionable
  - Focus on copy, design, value proposition, and call-to-action
  
  2. REDDIT LAUNCH POST
  - Write a Reddit post in authentic founder voice (200-300 words)
  - Suitable for r/SaaS or r/indiehackers
  - Include problem, solution, and call-to-action
  - Sound like a real founder, not marketing copy
  
  3. COLD OUTREACH EMAIL SEQUENCE
  - Write 3 emails (under 100 words each)
  - Include specific subject lines
  - Conversational tone, not salesy
  - Format: [Subject: ...] [Email body]
  
  Separate each section with "---" on its own line.
  ```
- **Fallback Logic**:
  - Primary: `meta-llama/llama-3.3-70b-instruct:free`
  - On 429: Retry with `google/gemma-4-31b-it:free`
  - On second failure: Return error to client

#### **lib/usage.ts**
- **Purpose**: Usage tracking and paywall enforcement
- **Exports**:
  - `checkUsageLimit(userId)`: Returns `{ canAnalyse: boolean, count: number, limit: number }`
  - `incrementUsageCount(userId)`: Increment analysis count after successful analysis

---

## Data Flow

### Analyse Flow (Happy Path)

```
1. User enters text in AnalyseInput
2. User clicks "Analyse" button
3. page.tsx checks if user is logged in
   - If not: show AuthModal
   - If yes: proceed to step 4
4. page.tsx calls POST /api/analyse with input_text
5. API route validates user and checks usage count
   - If limit reached: return 403 with paywall signal
   - If OK: proceed to step 6
6. API route calls OpenRouter with system prompt + input
7. OpenRouter returns three sections
8. API route stores analysis in Supabase
9. API route returns three outputs to client
10. page.tsx displays three OutputSection components
11. User can click "Copy" on each card to copy to clipboard
12. After 2nd analysis, PaywallModal appears on next analysis attempt
```

### Authentication Flow

```
1. User clicks "Analyse" without being logged in
2. page.tsx shows AuthModal
3. User enters email and password
4. AuthModal calls Supabase Auth API
5. On success: Supabase creates session, AuthModal closes
6. page.tsx detects user is now logged in
7. Analysis proceeds automatically with same input
```

### Paywall Flow

```
1. User completes 2nd analysis
2. On next "Analyse" click, API checks usage count
3. Count is 2, user is not paid → return 403
4. page.tsx shows PaywallModal
5. User clicks "Upgrade" button (Stripe integration added later)
6. After payment, user's subscription status is updated
7. User can now perform unlimited analyses
```

---

## Component Hierarchy

```
page.tsx (Main)
├── AnalyseInput
├── OutputSection (3x)
│   ├── LoadingState (while loading)
│   └── Copy button
├── AuthModal
│   ├── Email input
│   ├── Password input
│   └── Sign Up / Log In tabs
└── PaywallModal
    ├── Upgrade message
    └── Stripe button (placeholder)
```

---

## State Management

**No external state management library** (per tech stack rules). All state is managed with React `useState` hooks in `page.tsx`:

```typescript
const [user, setUser] = useState<User | null>(null);
const [inputText, setInputText] = useState('');
const [outputs, setOutputs] = useState<Outputs | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(false);
const [showPaywallModal, setShowPaywallModal] = useState(false);
const [error, setError] = useState<string | null>(null);
```

---

## Styling and Theme

- **Framework**: Tailwind CSS (no inline styles)
- **Components**: shadcn/ui for buttons, modals, inputs
- **Color Scheme**:
  - Background: `#0a0a0a` (dark)
  - Text: `#ffffff` (white)
  - Accent (button): `#22c55e` (green)
  - Card background: `#1a1a1a` (slightly lighter dark)
  - Border: `#333333` (subtle)
- **Responsive Breakpoints**:
  - Mobile: 320px - 767px (full width, stacked layout)
  - Tablet: 768px - 1023px (2-column layout)
  - Desktop: 1024px+ (3-column layout for outputs)

---

## API Integration Details

### OpenRouter API Call

**Endpoint**: `https://openrouter.ai/api/v1/chat/completions`

**Request:**
```json
{
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "messages": [
    {
      "role": "system",
      "content": "[system prompt from lib/openrouter.ts]"
    },
    {
      "role": "user",
      "content": "[user input]"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Headers:**
```
Authorization: Bearer [OPENROUTER_API_KEY]
Content-Type: application/json
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "[three sections separated by ---]"
      }
    }
  ]
}
```

**Parsing**: Split response by `---` to extract three sections.

---

## Error Handling Strategy

| Error | User Message | Action |
|-------|--------------|--------|
| Not authenticated | Auth modal appears | Prompt login/signup |
| Free tier limit reached | Paywall modal appears | Prompt upgrade |
| OpenRouter rate limited (429) | None (retry silently) | Retry with fallback model |
| OpenRouter other error | "Analysis failed. Please try again." | Show retry button |
| Network error | "Network error. Please check your connection." | Show retry button |
| Invalid input (empty) | "Please enter a URL or product description." | Highlight input field |
| Database error | "Something went wrong. Please try again." | Show retry button |

---

## Performance Considerations

1. **Skeleton Loaders**: Show immediately while waiting for AI response (typically 10-30 seconds)
2. **Button Disabled State**: Prevent duplicate submissions during processing
3. **Lazy Loading**: Components load on demand (no pre-loading of unused features)
4. **API Optimization**: Single endpoint `/api/analyse` handles all analysis logic
5. **Database Indexes**: `user_id` and `created_at` indexed for fast queries
6. **Caching**: No caching needed for v1 (analyses are unique per user)

---

## Security Considerations

1. **API Keys**: All secret keys (OpenRouter, Stripe) stored server-side only
2. **Authentication**: Supabase Auth handles session management securely
3. **Authorization**: API route validates user ownership of analyses
4. **Input Validation**: User input sanitized before sending to OpenRouter
5. **HTTPS**: All communications encrypted (Vercel enforces HTTPS)
6. **Rate Limiting**: OpenRouter handles rate limiting; app retries with fallback
7. **CORS**: API route only accepts requests from same origin

---

## Deployment Architecture

- **Hosting**: Vercel (serverless)
- **Database**: Supabase (managed PostgreSQL)
- **Auth**: Supabase Auth (managed)
- **AI API**: OpenRouter (third-party)
- **Payments**: Stripe (third-party, added later)

**Environment Variables** (set in Vercel dashboard):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`
- `STRIPE_SECRET_KEY` (added later)

---

## File Structure

```
app/
  page.tsx                    # Main page component
  layout.tsx                  # Root layout with dark theme
  api/
    analyse/
      route.ts                # POST /api/analyse endpoint

components/
  AnalyseInput.tsx            # Input field + button
  OutputSection.tsx           # Output card with copy button
  AuthModal.tsx               # Sign up / login modal
  PaywallModal.tsx            # Upgrade modal
  LoadingState.tsx            # Skeleton loader

lib/
  supabase.ts                 # Supabase client + utilities
  openrouter.ts               # OpenRouter API + system prompt
  usage.ts                    # Usage tracking + paywall logic

styles/
  globals.css                 # Tailwind + dark theme
```

---

## Testing Strategy (Not Implemented in v1)

- Unit tests for utility functions (usage.ts, openrouter.ts)
- Integration tests for API route (/api/analyse)
- E2E tests for user flows (auth, analyse, paywall)
- Manual testing on mobile, tablet, desktop

---

## Future Enhancements (Out of Scope v1)

- Stripe payment integration (placeholder in design)
- Usage history / dashboard
- Email notifications
- API for third-party integrations
- Multiple language support
- Advanced analytics
- Team features
