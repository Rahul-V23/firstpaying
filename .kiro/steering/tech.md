# Tech Stack — Locked, No Deviations

## Frontend
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS for all styling
- shadcn/ui for components

## Backend
- Next.js API routes (no separate backend)
- Supabase for auth and database
- OpenRouter API for AI features
  - Primary model: meta-llama/llama-3.3-70b-instruct:free
  - Fallback model: google/gemma-4-31b-it:free
  - API endpoint: https://openrouter.ai/api/v1/chat/completions

## Database (Supabase)
- users table: managed by Supabase Auth
- analyses table: id, user_id, created_at, input_text
- Track count of analyses per user for paywall enforcement

## Payments
- Stripe for subscriptions ($19/month)
- Add payment integration LAST after core product works

## Hosting
- Vercel free tier
- Environment variables for all API keys

## Environment Variables Needed
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- OPENROUTER_API_KEY
- STRIPE_SECRET_KEY (add later)

## Rules
- No external state management libraries (useState only)
- No unnecessary dependencies
- Mobile responsive by default
- Dark theme throughout
- Every API key in .env.local, never hardcoded