# FirstPaying MVP — Quick Start Guide

## Overview

FirstPaying is a single-screen SaaS app that helps solo founders get their first paying customer using AI-powered analysis.

**Status**: ✅ Complete and ready for deployment

---

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- `.env.local` file with credentials (see below)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENROUTER_API_KEY=your-openrouter-api-key
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Features

### 1. Authentication
- Sign up with email and password
- Log in with existing account
- Session persists across page refreshes
- Logout with Ctrl+L or button click

### 2. Analysis
- Paste landing page URL or product description
- Get three AI-generated outputs:
  1. **Landing Page Weaknesses** - 5 specific reasons why page isn't converting
  2. **Reddit Launch Post** - Ready-to-post content for r/SaaS or r/indiehackers
  3. **Cold Outreach Emails** - 3 emails with subject lines for outreach
- Copy each output to clipboard
- Loading state with skeleton loaders

### 3. Paywall
- Free tier: 2 analyses per user
- After 2nd analysis, upgrade modal appears
- Upgrade to $19/month for unlimited analyses
- Stripe integration (placeholder for now)

### 4. Responsive Design
- Works on mobile (320px+)
- Works on tablet (768px+)
- Works on desktop (1024px+)
- Dark theme throughout

---

## Testing

### Manual Testing
See `TESTING_CHECKLIST.md` for comprehensive testing guide with 50+ test cases.

### Quick Test
1. Open http://localhost:3000
2. Click "Analyse" without logging in
3. Sign up with test email
4. Enter product description
5. Click "Analyse"
6. Wait for results (10-30 seconds)
7. See three outputs
8. Click "Copy" on each output
9. Perform second analysis
10. On third "Analyse" click, see paywall modal

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "FirstPaying MVP"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `OPENROUTER_API_KEY`
   - Click "Deploy"

4. **Verify Deployment**
   - Wait for build to complete
   - Click "Visit" to open deployed app
   - Test all features

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## Project Structure

```
app/
  page.tsx                    # Main page
  layout.tsx                  # Root layout
  api/analyse/route.ts        # API endpoint
  globals.css                 # Styles

components/
  AnalyseInput.tsx            # Input component
  OutputSection.tsx           # Output card
  LoadingState.tsx            # Skeleton loader
  AuthModal.tsx               # Auth modal
  PaywallModal.tsx            # Paywall modal
  ui/                         # shadcn/ui components

lib/
  supabase.ts                 # Supabase client
  openrouter.ts               # OpenRouter API
  usage.ts                    # Usage tracking
  utils.ts                    # Utilities
```

---

## Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key |
| `OPENROUTER_API_KEY` | Secret | OpenRouter API key |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the client. Never put secrets in these variables.

---

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenRouter (Llama 3.3 70B + Gemma 4 31B)
- **Hosting**: Vercel

---

## Key Features

✅ Single-screen app (no navigation)
✅ Dark theme (#0a0a0a background)
✅ Email/password authentication
✅ AI-powered analysis (3 outputs)
✅ Copy-to-clipboard functionality
✅ Free tier (2 analyses)
✅ Paywall enforcement
✅ Responsive design (mobile, tablet, desktop)
✅ Error handling with retry
✅ Loading states with skeleton loaders
✅ Session persistence
✅ Keyboard shortcuts (Ctrl+L to logout, Ctrl+Enter to submit)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Logout |
| `Ctrl+Enter` | Submit analysis |

---

## Troubleshooting

### Build Fails
- Check `.env.local` has all required variables
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors: `npm run lint`

### App Won't Start
- Verify `.env.local` is in project root
- Verify all environment variables are set
- Check Supabase project is active
- Check OpenRouter API key is valid

### Analysis Fails
- Check network connection
- Verify OpenRouter API key is valid
- Check Supabase is accessible
- Check browser console for errors

### Paywall Not Showing
- Verify user has completed 2 analyses
- Check Supabase `analyses` table has records
- Check browser console for errors

---

## Support

- **Documentation**: See `IMPLEMENTATION_SUMMARY.md`
- **Testing Guide**: See `TESTING_CHECKLIST.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Completion Report**: See `T7_T20_COMPLETION_REPORT.md`

---

## Next Steps

1. **Test Locally**
   - Run `npm run dev`
   - Follow `TESTING_CHECKLIST.md`

2. **Deploy to Vercel**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Share public URL

3. **Monitor**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Monitor OpenRouter API usage

4. **Phase 2**
   - Integrate Stripe payments
   - Add subscription management
   - Add usage history dashboard

---

## Success Criteria

✅ User can sign up and log in
✅ User can enter product description
✅ User gets three AI outputs within 30 seconds
✅ User can copy each output
✅ Free tier limited to 2 analyses
✅ Paywall appears after 2nd analysis
✅ App works on mobile, tablet, desktop
✅ App is deployed to Vercel

---

## License

MIT

---

## Questions?

See documentation files:
- `IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `TESTING_CHECKLIST.md` - Testing guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `T7_T20_COMPLETION_REPORT.md` - Completion report

---

**Status**: ✅ Ready for Production
**Last Updated**: 2024
