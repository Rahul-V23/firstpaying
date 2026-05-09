# FirstPaying MVP — Requirements

## Introduction

FirstPaying is a micro-SaaS web application designed for solo founders and indie hackers who have built a product but struggle to acquire their first paying customer. The app provides AI-powered analysis of landing pages or product descriptions, delivering three actionable outputs: conversion weaknesses, a Reddit launch post, and a cold outreach email sequence.

This is a single-screen application with no dashboard, settings, or navigation. The entire user experience is contained on one page: input → analyse → three outputs.

## Glossary

- **Landing Page**: A URL or text description of a founder's product/service
- **Analysis**: A single run of the AI analysis on user input (tracked for paywall enforcement)
- **Free Tier**: 2 analyses per user before paywall
- **Paid Tier**: Unlimited analyses for $19/month via Stripe
- **OpenRouter API**: Third-party AI API providing access to LLMs (Llama 3.3 70B primary, Gemma 4 31B fallback)
- **Supabase**: Backend-as-a-service for authentication and database
- **Skeleton Loader**: Animated placeholder UI shown while AI generates output

---

## Requirement 1: Single-Screen User Interface

**User Story:** As a solo founder, I want to see a clean, minimal interface with one input field and one button so that I can quickly paste my landing page URL or product description and get analysis without distraction.

### Acceptance Criteria

1. The page displays a dark background (#0a0a0a) with no navigation, menu, or dashboard elements
2. The top of the page shows "FirstPaying" as the app name and "Get your first paying user" as the tagline
3. A large text area input is centered with placeholder text: "Paste your landing page URL or describe your product in 2-3 sentences..."
4. An "Analyse" button appears directly below the input, styled in green, full width on mobile devices
5. The input field accepts both URLs and free-form text descriptions
6. The page is responsive and works on mobile, tablet, and desktop screens
7. No other UI elements (settings, history, dashboard) are visible on the page

---

## Requirement 2: Authentication with Supabase

**User Story:** As a new user, I want to sign up or log in with my email and password so that my analyses are tracked and I can access my paid subscription if I upgrade.

### Acceptance Criteria

1. When a user clicks "Analyse" without being logged in, a modal appears with sign up / login options
2. The modal accepts email and password for both sign up and login flows
3. After successful authentication, the modal closes and the analysis proceeds automatically with the same input
4. Supabase Auth manages all user credentials securely
5. The user remains logged in across page refreshes (session persistence)
6. A logout option is available (minimal UI, e.g., in a corner or accessible via keyboard)
7. Authentication errors (invalid email, password mismatch, etc.) display clear error messages

---

## Requirement 3: AI Analysis via OpenRouter API

**User Story:** As a founder, I want to submit my landing page or product description and receive three AI-generated outputs so that I get actionable insights to improve my conversion and acquire my first customer.

### Acceptance Criteria

1. When the user clicks "Analyse", the app calls the OpenRouter API with the user's input
2. The primary model used is `meta-llama/llama-3.3-70b-instruct:free`
3. If the primary model returns a 429 (rate limit) error, the app automatically retries with `google/gemma-4-31b-it:free`
4. The system prompt in `lib/openrouter.ts` instructs the AI to return three clearly separated sections:
   - **Section 1**: Five specific reasons the landing page isn't converting (bullet points)
   - **Section 2**: A Reddit launch post in authentic founder voice (ready to copy-paste)
   - **Section 3**: A 3-email cold outreach sequence with subject lines (under 100 words per email)
5. The API call includes the user's input text and returns a structured response
6. If the API call fails after retry, an error message is displayed to the user
7. The analysis is recorded in the Supabase `analyses` table with user_id, input_text, and created_at timestamp

---

## Requirement 4: Three Output Cards with Copy Functionality

**User Story:** As a founder, I want to see the three AI outputs in separate cards with copy buttons so that I can easily copy each output to my clipboard and use them immediately.

### Acceptance Criteria

1. Three output cards are displayed below the input, one for each AI output section
2. Each card displays its title (e.g., "Landing Page Weaknesses", "Reddit Launch Post", "Cold Outreach Emails")
3. Each card contains the full text of the corresponding AI output
4. Each card has a "Copy" button that copies the card's content to the user's clipboard
5. After clicking "Copy", the button shows a brief confirmation (e.g., "Copied!" for 2 seconds)
6. The cards are responsive and stack vertically on mobile devices
7. The cards display a skeleton loader (animated placeholder) while the AI is generating output
8. Once output is received, the skeleton loader is replaced with the actual content

---

## Requirement 5: Usage Tracking and Free Tier Limit

**User Story:** As a free user, I want to know how many analyses I have left so that I understand when I need to upgrade to continue using the app.

### Acceptance Criteria

1. The app tracks the number of analyses per user in the Supabase `analyses` table
2. Free users are limited to 2 analyses total
3. After the user completes their 2nd analysis, the app displays a paywall modal
4. The paywall modal shows the message: "You've used your 2 free analyses. Unlock unlimited for $19/month"
5. The paywall modal includes a Stripe payment button (placeholder for now, wired up in a later phase)
6. The paywall modal prevents further analyses until the user upgrades or closes the modal
7. Paid users (subscription active) can perform unlimited analyses
8. The subscription status is checked before each analysis to determine if the paywall should be shown

---

## Requirement 6: Paywall Modal and Upgrade Flow

**User Story:** As a free user who has exhausted my analyses, I want to see a clear upgrade option so that I can subscribe and continue using the app.

### Acceptance Criteria

1. The paywall modal appears after the 2nd analysis is completed
2. The modal displays the upgrade offer: "$19/month for unlimited analyses"
3. A Stripe payment button is present in the modal (integration added in later phase)
4. The modal has a close button to dismiss it (user can close without upgrading)
5. If the user upgrades, their subscription status is updated in Supabase
6. After upgrade, the user can immediately perform another analysis without the paywall reappearing
7. The paywall modal is styled consistently with the dark theme

---

## Requirement 7: Environment Variables and Configuration

**User Story:** As a developer, I want all API keys and configuration to be stored in environment variables so that the app is secure and can be deployed to different environments.

### Acceptance Criteria

1. The following environment variables are required:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
   - `OPENROUTER_API_KEY`: OpenRouter API key (server-side only)
   - `STRIPE_SECRET_KEY`: Stripe secret key (added in later phase, server-side only)
2. All API keys are stored in `.env.local` and never hardcoded in source files
3. Public keys (Supabase URL and anon key) are prefixed with `NEXT_PUBLIC_` for client-side access
4. Secret keys (OpenRouter, Stripe) are server-side only and never exposed to the client
5. The app fails gracefully with clear error messages if required environment variables are missing

---

## Requirement 8: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages when something goes wrong so that I understand what happened and can take action.

### Acceptance Criteria

1. If the OpenRouter API call fails, an error message is displayed: "Analysis failed. Please try again."
2. If the user is not authenticated, the auth modal appears when they click "Analyse"
3. If the user has exhausted their free analyses, the paywall modal appears
4. If a network error occurs, the user sees a retry option
5. All error states are handled gracefully without crashing the app
6. Loading states are shown during API calls so the user knows the app is working

---

## Requirement 9: Responsive Design and Mobile Optimization

**User Story:** As a mobile user, I want the app to work seamlessly on my phone so that I can use FirstPaying on the go.

### Acceptance Criteria

1. The app is fully responsive on mobile (320px+), tablet (768px+), and desktop (1024px+) screens
2. The "Analyse" button is full width on mobile for easy tapping
3. The text area input is appropriately sized for mobile keyboards
4. Output cards stack vertically on mobile and display side-by-side on larger screens (if space allows)
5. All buttons and interactive elements have adequate touch targets (minimum 44px)
6. The dark theme is consistent across all screen sizes
7. No horizontal scrolling is required on any screen size

---

## Requirement 10: Performance and Loading States

**User Story:** As a user, I want to see visual feedback while the app is processing my analysis so that I know it's working and how long to wait.

### Acceptance Criteria

1. While the AI is generating output, skeleton loaders are displayed in each output card
2. The skeleton loaders are animated to indicate loading progress
3. The "Analyse" button is disabled during processing to prevent duplicate submissions
4. The button shows a loading state (e.g., "Analysing...") while processing
5. Once the output is received, the skeleton loaders are replaced with actual content
6. The entire process completes within a reasonable time (target: under 30 seconds)
7. If the process takes longer than expected, a timeout message is shown

---

## Requirement 11: Data Privacy and Security

**User Story:** As a user, I want my data to be secure and private so that I trust FirstPaying with my product information.

### Acceptance Criteria

1. All user data (email, analyses) is stored securely in Supabase
2. API keys are never exposed to the client-side code
3. The app uses HTTPS for all communications
4. User sessions are managed securely by Supabase Auth
5. The app does not store or share user data with third parties (except OpenRouter for AI analysis)
6. User analyses are associated with their user_id in the database

---

## Requirement 12: Deployment Readiness

**User Story:** As a developer, I want the app to be ready for deployment to Vercel so that it can be accessed by users.

### Acceptance Criteria

1. The app is built with Next.js 15 and TypeScript
2. All dependencies are listed in `package.json`
3. The app builds successfully with `npm run build`
4. The app runs successfully with `npm run dev` for local development
5. Environment variables are configured for Vercel deployment
6. The app is optimized for Vercel's serverless environment
7. No local-only dependencies or configurations are present

---

## Out of Scope (v1)

The following features are explicitly NOT included in this MVP:

- Dashboard or analytics page
- Settings page or user preferences
- Team features or collaboration
- Usage history or analysis archive
- Integrations with other tools
- Email notifications
- API for third-party integrations
- Multiple language support
- Advanced payment options (only Stripe)

---

## Success Criteria

The FirstPaying MVP is considered complete when:

1. A solo founder can sign up, paste a landing page URL or product description, and receive three AI-generated outputs within 30 seconds
2. Free users are limited to 2 analyses and see a paywall modal after the 2nd analysis
3. The app is fully responsive on mobile, tablet, and desktop
4. All API keys are securely managed via environment variables
5. The app is deployed to Vercel and accessible via a public URL
6. Error handling is graceful and user-friendly
7. The UI is clean, minimal, and dark-themed throughout
