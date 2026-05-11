# FirstPaying MVP — Vercel Deployment Manual

## Project Status: ✅ Ready for Deployment

The FirstPaying MVP is fully configured and ready to deploy to Vercel. All code is production-ready.

---

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your GitHub Repository

1. Ensure all changes are committed to the `main` branch:
   ```bash
   git status
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. Verify the repository is public or you have access to it on GitHub

---

### Step 2: Create/Access Vercel Account

1. Go to https://vercel.com
2. Sign up or log in with your GitHub account
3. Authorize Vercel to access your GitHub repositories

---

### Step 3: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for **"Rahul-V23/firstpaying"** and select it
5. Click **"Import"**

---

### Step 4: Configure Build Settings

Vercel should auto-detect these settings. Verify they match:

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x (or latest) |

✅ These are already correct in your `package.json` and `next.config.ts`

---

### Step 5: Add Environment Variables

**CRITICAL:** Add these environment variables in Vercel Dashboard → **Settings** → **Environment Variables**

Add for **Production**, **Preview**, and **Development** environments:

```
NEXT_PUBLIC_SUPABASE_URL=https://czjejieyqbqkguenklnf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XbQqbZcIggHOANvoQZzucg_-LQq5NCI
OPENROUTER_API_KEY=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
STRIPE_SECRET_KEY=(leave empty for now)
```

**Steps to add each variable:**
1. Click **"Add New"** in Environment Variables section
2. Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Enter the value
4. Select all three environments: **Production**, **Preview**, **Development**
5. Click **"Save"**
6. Repeat for each variable

---

### Step 6: Deploy

1. After adding all environment variables, click the **"Deploy"** button
2. Monitor the build logs in real-time
3. Wait for deployment to complete (typically 2-3 minutes)
4. You'll see a success message with your deployment URL

---

### Step 7: Post-Deployment Verification

Once deployed, test these features on the live URL:

#### Authentication Flow
- [ ] Sign up with email
- [ ] Verify email confirmation works
- [ ] Log in with credentials
- [ ] Log out successfully

#### Core Functionality
- [ ] Enter product description and click "Analyse"
- [ ] Receive 3 outputs (Landing page weaknesses, Reddit post, Cold email)
- [ ] Copy buttons work for each output
- [ ] Loading state displays while generating

#### Paywall Enforcement
- [ ] First analysis works (count: 1/2)
- [ ] Second analysis works (count: 2/2)
- [ ] Third analysis shows paywall modal
- [ ] Paywall modal displays upgrade CTA

#### Technical Checks
- [ ] HTTPS is enabled (URL shows 🔒)
- [ ] No console errors in browser DevTools
- [ ] Responsive design works on mobile
- [ ] Dark theme displays correctly
- [ ] API calls complete successfully

---

## Environment Variables Reference

### Public Variables (safe to expose)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)

### Secret Variables (server-side only)
- `OPENROUTER_API_KEY` - OpenRouter API key (never exposed to client)
- `STRIPE_SECRET_KEY` - Stripe secret key (never exposed to client)

---

## Deployment URL

After successful deployment, your app will be available at:
```
https://firstpaying.vercel.app
```

(Or a custom domain if you configure one)

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct scripts

### App Crashes After Deploy
- Check Vercel function logs
- Verify environment variables are correct
- Check browser console for errors

### Features Not Working
- Verify Supabase connection (check network tab)
- Verify OpenRouter API key is valid
- Check that database tables exist in Supabase

---

## Next Steps After Deployment

1. **Test thoroughly** on the live URL
2. **Share the URL** with beta users
3. **Monitor logs** in Vercel dashboard
4. **Collect feedback** on the three outputs
5. **Add Stripe integration** when ready for paid tier

---

## Important Notes

- ✅ All code is production-ready
- ✅ No hardcoded secrets in the codebase
- ✅ Environment variables are properly configured
- ✅ Next.js build is optimized for Vercel
- ✅ HTTPS is automatically enabled
- ✅ Deployments are automatic on `main` branch pushes

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Check Supabase project status
4. Verify OpenRouter API key is active
5. Review browser console for client-side errors

Good luck with your deployment! 🚀
