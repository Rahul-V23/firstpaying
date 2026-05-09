# FirstPaying MVP — Deployment Guide (T20)

## Overview

This guide walks through deploying FirstPaying to Vercel for public access.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- All code committed and ready to push
- Environment variables configured locally

## Step 1: Create GitHub Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: FirstPaying MVP"
```

### 1.2 Create Repository on GitHub
1. Go to https://github.com/new
2. Create repository named `firstpaying`
3. Do NOT initialize with README (we already have one)
4. Click "Create repository"

### 1.3 Push Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/firstpaying.git
git branch -M main
git push -u origin main
```

### 1.4 Verify Repository
- Visit https://github.com/YOUR_USERNAME/firstpaying
- Verify all files are present
- Verify no `.env.local` file is committed (should be in .gitignore)

## Step 2: Connect Vercel to GitHub

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2.2 Create New Project
1. Click "New Project"
2. Select "Import Git Repository"
3. Search for "firstpaying"
4. Click "Import"

### 2.3 Configure Project
1. **Project Name**: `firstpaying` (or custom name)
2. **Framework**: Should auto-detect "Next.js"
3. **Root Directory**: `.` (default)
4. Click "Continue"

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Vercel
1. In the "Environment Variables" section, add:

```
NEXT_PUBLIC_SUPABASE_URL = [your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-supabase-anon-key]
OPENROUTER_API_KEY = [your-openrouter-api-key]
```

2. For each variable:
   - Enter the name
   - Enter the value
   - Click "Add"

### 3.2 Verify Variables
- All three variables should be listed
- No variables should be empty
- Click "Deploy" to proceed

## Step 4: Deploy

### 4.1 Initial Deployment
1. Click "Deploy"
2. Wait for build to complete (typically 2-3 minutes)
3. You should see "Congratulations! Your project has been successfully deployed"

### 4.2 Verify Deployment
1. Click "Visit" to open the deployed app
2. App should load on Vercel's domain (e.g., `firstpaying.vercel.app`)
3. Verify HTTPS is enabled (URL should start with `https://`)

## Step 5: Test Deployed App

### 5.1 Authentication Test
1. Click "Analyse" without being logged in
2. Auth modal should appear
3. Sign up with test email
4. Modal should close and user should be logged in

### 5.2 Analysis Test
1. Enter product description
2. Click "Analyse"
3. Loading state should appear
4. After 10-30 seconds, three outputs should appear
5. Click "Copy" on each output
6. Verify content is copied to clipboard

### 5.3 Paywall Test
1. Perform two analyses
2. On third "Analyse" click, paywall modal should appear
3. Verify paywall message is correct

### 5.4 Error Handling Test
1. Try to submit empty input
2. Error message should appear
3. Dismiss error and try again

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain
1. In Vercel project settings, go to "Domains"
2. Click "Add"
3. Enter your custom domain (e.g., `firstpaying.com`)
4. Follow DNS configuration instructions

### 6.2 Verify Domain
1. Wait for DNS to propagate (typically 5-30 minutes)
2. Visit your custom domain
3. App should load on custom domain

## Step 7: Continuous Deployment

### 7.1 Auto-Deploy on Push
- Vercel automatically deploys when you push to `main` branch
- Each push triggers a new build
- Deployments are automatic and free

### 7.2 Monitor Deployments
1. Go to Vercel project dashboard
2. Click "Deployments" tab
3. View deployment history
4. Click on any deployment to see logs

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies
3. Fix locally, push to GitHub, and Vercel will auto-redeploy

### App Crashes on Vercel
1. Check Vercel function logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase connection

### Slow Performance
1. Check Vercel analytics
2. Optimize images and assets
3. Consider upgrading Vercel plan for better performance

## Rollback

### Rollback to Previous Deployment
1. Go to Vercel project dashboard
2. Click "Deployments" tab
3. Find previous deployment
4. Click "..." menu
5. Click "Promote to Production"

## Next Steps

After deployment:
1. Share public URL with users
2. Monitor analytics in Vercel dashboard
3. Monitor Supabase usage
4. Monitor OpenRouter API usage
5. Plan for Stripe integration (Phase 2)

## Environment Variables Reference

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key |
| `OPENROUTER_API_KEY` | Secret | OpenRouter API key |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the client. Never put secrets in these variables.

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys are hardcoded in source files
- [ ] All secrets are in Vercel environment variables
- [ ] HTTPS is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] Supabase RLS policies are configured
- [ ] No sensitive data is logged to console

## Monitoring

### Vercel Analytics
- Monitor page load times
- Monitor error rates
- Monitor deployment frequency

### Supabase Monitoring
- Monitor database usage
- Monitor auth events
- Monitor API calls

### OpenRouter Monitoring
- Monitor API usage
- Monitor rate limits
- Monitor costs

## Support

- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- OpenRouter Support: https://openrouter.ai/support
