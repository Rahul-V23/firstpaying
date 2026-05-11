# FirstPaying MVP - Vercel Deployment Guide

## Deployment Status: READY FOR PRODUCTION

### ✅ Pre-Deployment Checklist

- [x] GitHub repository configured: https://github.com/Rahul-V23/firstpaying
- [x] Code committed and ready to push
- [x] Build verified locally (npm run build succeeds)
- [x] .gitignore properly configured
- [x] Environment variables identified
- [x] Next.js 15 with App Router configured
- [x] TypeScript strict mode enabled
- [x] Tailwind CSS configured
- [x] API routes ready (/api/analyse)

---

## Step-by-Step Deployment Instructions

### 1. GitHub Repository Setup

**Status**: Remote configured, ready to push

```bash
# Remote already added:
git remote -v
# origin  https://github.com/Rahul-V23/firstpaying.git (fetch)
# origin  https://github.com/Rahul-V23/firstpaying.git (push)

# Push to GitHub (may require authentication):
git push -u origin main
```

**Note**: If push requires authentication, use GitHub CLI or personal access token:
```bash
# Using GitHub CLI (recommended):
gh auth login
git push -u origin main

# Or use personal access token in URL:
git push -u https://[token]@github.com/Rahul-V23/firstpaying.git main
```

---

### 2. Vercel Project Setup

**Steps**:

1. Go to https://vercel.com
2. Sign in or create account
3. Click "Add New..." → "Project"
4. Select "Import Git Repository"
5. Search for "firstpaying" and select the repository
6. Click "Import"

**Build Settings** (should auto-detect):
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x (recommended)

---

### 3. Environment Variables Configuration

In Vercel Dashboard, go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://czjejieyqbqkguenklnf.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_XbQqbZcIggHOANvoQZzucg_-LQq5NCI` | Production, Preview, Development |
| `OPENROUTER_API_KEY` | `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` | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | (leave empty for now) | Production |

**Important**: 
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for public keys)
- `OPENROUTER_API_KEY` and `STRIPE_SECRET_KEY` are server-side only
- All variables must be set for Production environment

---

### 4. Deployment

**Automatic Deployment**:
- Once GitHub is connected, every push to `main` branch triggers automatic deployment
- Vercel will build and deploy automatically

**Manual Deployment**:
1. In Vercel Dashboard, click "Deployments"
2. Click "Redeploy" on the latest commit

**Monitoring**:
- Watch build logs in Vercel Dashboard
- Build should complete in ~2-3 minutes
- Check for any errors in the build output

---

### 5. Post-Deployment Verification

Once deployment completes, verify:

#### ✅ Access the App
- Visit the Vercel deployment URL (e.g., `https://firstpaying.vercel.app`)
- Page should load with dark theme
- Input fields should be visible

#### ✅ Test Authentication Flow
1. Click "Sign In" button
2. Enter email and password
3. Verify Supabase auth works
4. Check user is logged in

#### ✅ Test Analysis Flow
1. Enter sample text or URL
2. Click "Analyse"
3. Verify loading state appears
4. Verify 3 outputs are generated:
   - Landing page weaknesses
   - Reddit launch post
   - Cold outreach email sequence

#### ✅ Test Paywall
1. Create new account
2. Run 2 analyses
3. On 3rd attempt, paywall modal should appear
4. Verify "Upgrade" button is visible

#### ✅ Test Responsive Design
- Test on mobile (use browser DevTools)
- Verify layout adapts properly
- Check all buttons are clickable

#### ✅ Test Error Handling
- Try submitting empty input
- Verify error message appears
- Try with invalid API key (should show error)

#### ✅ Verify HTTPS
- URL should be `https://` (automatic on Vercel)
- Check SSL certificate is valid
- No mixed content warnings

---

## Environment Variables Reference

### Public Variables (exposed to browser)
```
NEXT_PUBLIC_SUPABASE_URL=https://czjejieyqbqkguenklnf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XbQqbZcIggHOANvoQZzucg_-LQq5NCI
```

### Server-Side Variables (secure)
```
OPENROUTER_API_KEY=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
STRIPE_SECRET_KEY=(add when payment integration is ready)
```

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles locally: `npm run build`

### Environment Variables Not Working
- Verify variables are set in Vercel Dashboard
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_*` prefix for public variables
- Redeploy after adding variables

### API Calls Fail
- Verify `OPENROUTER_API_KEY` is correct
- Check Supabase URL and key are valid
- Test API locally: `npm run dev`

### Authentication Issues
- Verify Supabase project is active
- Check auth configuration in `lib/supabase.ts`
- Ensure redirect URLs are configured in Supabase

### Paywall Not Working
- Verify Supabase `analyses` table exists
- Check user_id is being tracked correctly
- Test locally first: `npm run dev`

---

## Custom Domain (Optional)

To add a custom domain:

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `firstpaying.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

---

## Monitoring & Maintenance

### View Deployment Status
- Vercel Dashboard: https://vercel.com/dashboard
- Check build logs and deployment history
- Monitor function execution time

### View Analytics
- Vercel provides built-in analytics
- Check page load times and errors
- Monitor API route performance

### Rollback
- If deployment has issues, click "Rollback" in Vercel Dashboard
- Reverts to previous working deployment

---

## Next Steps After Deployment

1. **Share Public URL** with beta testers
2. **Monitor Error Logs** in Vercel Dashboard
3. **Collect User Feedback** on functionality
4. **Add Stripe Integration** when ready for payments
5. **Set Up Custom Domain** for branding
6. **Configure Analytics** to track usage

---

## Deployment Checklist

- [ ] Code pushed to GitHub main branch
- [ ] Vercel project created and connected
- [ ] Environment variables configured in Vercel
- [ ] Build completes successfully
- [ ] App accessible via public URL
- [ ] Authentication flow tested
- [ ] Analysis generation tested
- [ ] Paywall enforcement tested
- [ ] Responsive design verified
- [ ] HTTPS enabled
- [ ] Error handling verified
- [ ] Ready for beta testing

---

## Support

For issues:
1. Check Vercel Dashboard build logs
2. Review error messages in browser console
3. Test locally with `npm run dev`
4. Check Supabase dashboard for database issues
5. Verify API keys are correct

---

**Deployment Date**: Ready for immediate deployment
**Status**: ✅ All systems ready
**Next Action**: Push to GitHub and connect to Vercel
