# FirstPaying MVP — Testing Checklist

## T15: Test Authentication Flow

### Prerequisites
- App is running on localhost:3000
- Supabase project is configured
- .env.local has valid credentials

### Test Cases

#### 1. Sign Up with New Email
- [ ] Open app in browser
- [ ] Click "Analyse" button without being logged in
- [ ] Auth modal appears with "Sign Up" tab active
- [ ] Enter new email (e.g., test@example.com)
- [ ] Enter password (at least 6 characters)
- [ ] Click "Sign Up" button
- [ ] Modal closes
- [ ] User is logged in (email shown in header)
- [ ] Can proceed with analysis

#### 2. Log In with Existing Email
- [ ] Click "Logout" button
- [ ] Click "Analyse" button
- [ ] Auth modal appears
- [ ] Switch to "Log In" tab
- [ ] Enter email and password from previous test
- [ ] Click "Log In" button
- [ ] Modal closes
- [ ] User is logged in

#### 3. Session Persistence
- [ ] User is logged in
- [ ] Refresh page (F5)
- [ ] User is still logged in (email shown in header)
- [ ] Session persists across page refreshes

#### 4. Logout
- [ ] Click "Logout" button in header
- [ ] User is logged out
- [ ] Header no longer shows email
- [ ] Next "Analyse" click shows auth modal

#### 5. Error Handling
- [ ] Try to sign up with invalid email (e.g., "notanemail")
- [ ] Error message appears: "Please enter a valid email address."
- [ ] Try to sign up with password < 6 characters
- [ ] Error message appears: "Password must be at least 6 characters."
- [ ] Try to log in with wrong password
- [ ] Error message appears from Supabase
- [ ] Try to sign up with existing email
- [ ] Error message appears from Supabase

---

## T16: Test Analysis Flow

### Prerequisites
- User is logged in
- App is running

### Test Cases

#### 1. Input Validation
- [ ] Try to click "Analyse" with empty input
- [ ] Error message appears: "Please enter a URL or product description."
- [ ] Input field is highlighted
- [ ] Enter text in input field
- [ ] Error message disappears

#### 2. Analysis Submission
- [ ] Enter product description (e.g., "A tool to help founders get their first paying customer")
- [ ] Click "Analyse" button
- [ ] Button shows "Analysing..." text
- [ ] Button is disabled
- [ ] Loading state appears (3 skeleton loaders)

#### 3. API Response
- [ ] Wait for API response (typically 10-30 seconds)
- [ ] Skeleton loaders are replaced with actual content
- [ ] Three output cards appear:
  - [ ] "Landing Page Weaknesses"
  - [ ] "Reddit Launch Post"
  - [ ] "Cold Outreach Emails"
- [ ] Each card contains relevant content
- [ ] Button returns to "Analyse" state

#### 4. Copy Functionality
- [ ] Click "Copy" button on first output card
- [ ] Button shows "Copied!" confirmation
- [ ] After 2 seconds, button returns to "Copy"
- [ ] Paste content somewhere to verify it was copied
- [ ] Repeat for other output cards

#### 5. Error Handling
- [ ] Simulate network error (disconnect internet)
- [ ] Try to analyse
- [ ] Error message appears: "Network error. Please check your connection and try again."
- [ ] Reconnect internet
- [ ] Try again
- [ ] Analysis succeeds

---

## T17: Test Paywall Enforcement

### Prerequisites
- User is logged in
- User has not yet performed 2 analyses

### Test Cases

#### 1. First Analysis
- [ ] Perform first analysis
- [ ] Analysis completes successfully
- [ ] Three outputs are displayed
- [ ] No paywall modal appears

#### 2. Second Analysis
- [ ] Perform second analysis
- [ ] Analysis completes successfully
- [ ] Three outputs are displayed
- [ ] No paywall modal appears

#### 3. Paywall Trigger
- [ ] Click "Analyse" button again
- [ ] Paywall modal appears
- [ ] Modal displays: "You've used your 2 free analyses. Unlock unlimited for $19/month"
- [ ] Modal shows upgrade benefits:
  - [ ] "Unlimited analyses"
  - [ ] "Priority support"
  - [ ] "Cancel anytime"
- [ ] "Upgrade Now" button is present
- [ ] "Maybe Later" button is present

#### 4. Dismiss Paywall
- [ ] Click "Maybe Later" button
- [ ] Modal closes
- [ ] User is back on main page
- [ ] Input field is empty

#### 5. Paywall Reappears
- [ ] Click "Analyse" button again
- [ ] Paywall modal appears again
- [ ] User cannot perform another analysis without upgrading

#### 6. Upgrade Button (Placeholder)
- [ ] Click "Upgrade Now" button
- [ ] Button shows "Processing..." state
- [ ] (Stripe integration will be added in future phase)

---

## T18: Test Error Handling

### Prerequisites
- App is running
- User is logged in

### Test Cases

#### 1. Empty Input Validation
- [ ] Try to submit empty input
- [ ] Error message appears: "Please enter a URL or product description."
- [ ] Input field is focused

#### 2. Network Error
- [ ] Disconnect internet
- [ ] Try to analyse
- [ ] Error message appears: "Network error. Please check your connection and try again."
- [ ] Reconnect internet
- [ ] Try again
- [ ] Analysis succeeds

#### 3. API Error (Simulated)
- [ ] (Requires mocking OpenRouter API failure)
- [ ] Error message appears: "Analysis failed. Please try again."
- [ ] User can retry

#### 4. Error Dismissal
- [ ] Error message is displayed
- [ ] Click "Dismiss" button
- [ ] Error message disappears
- [ ] User can try again

#### 5. App Stability
- [ ] Perform multiple analyses
- [ ] Trigger errors multiple times
- [ ] App does not crash
- [ ] App remains responsive

---

## T19: Test Responsive Design

### Prerequisites
- App is running
- Browser dev tools available

### Test Cases

#### 1. Mobile (320px width)
- [ ] Open browser dev tools
- [ ] Set viewport to 320px width (iPhone SE)
- [ ] App layout is responsive
- [ ] Input field is full width
- [ ] "Analyse" button is full width
- [ ] Output cards stack vertically
- [ ] No horizontal scrolling
- [ ] All buttons have adequate touch targets (44px+)
- [ ] Text is readable

#### 2. Tablet (768px width)
- [ ] Set viewport to 768px width (iPad)
- [ ] App layout is responsive
- [ ] Input field is appropriately sized
- [ ] Output cards display side-by-side (2-3 columns)
- [ ] No horizontal scrolling
- [ ] All interactive elements are accessible

#### 3. Desktop (1024px+ width)
- [ ] Set viewport to 1024px+ width
- [ ] App layout is responsive
- [ ] Input field is constrained width (max-w-2xl)
- [ ] Output cards display side-by-side (3 columns)
- [ ] No horizontal scrolling
- [ ] All interactive elements are accessible

#### 4. Touch Targets
- [ ] All buttons have minimum 44px height
- [ ] All input fields have minimum 44px height
- [ ] Buttons are easily tappable on mobile

#### 5. Text Readability
- [ ] Text is readable on all screen sizes
- [ ] Font sizes are appropriate
- [ ] Line heights are adequate
- [ ] Contrast is sufficient (dark theme)

#### 6. Modal Responsiveness
- [ ] Auth modal is responsive on mobile
- [ ] Auth modal is centered on all screen sizes
- [ ] Paywall modal is responsive on mobile
- [ ] Paywall modal is centered on all screen sizes

---

## T20: Deploy to Vercel

### Prerequisites
- All tests T15-T19 pass
- GitHub repository is ready
- Vercel account is available

### Deployment Steps

#### 1. GitHub Repository
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify all files are committed
- [ ] No sensitive data in repository

#### 2. Vercel Project
- [ ] Create Vercel account (if needed)
- [ ] Connect Vercel to GitHub repository
- [ ] Select repository
- [ ] Configure build settings (should auto-detect Next.js)

#### 3. Environment Variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Add `OPENROUTER_API_KEY` to Vercel
- [ ] Verify all variables are set

#### 4. Deployment
- [ ] Trigger deployment
- [ ] Wait for build to complete
- [ ] Verify build succeeded
- [ ] App is accessible via public URL

#### 5. Verification
- [ ] Open app in browser via public URL
- [ ] Test authentication flow
- [ ] Test analysis flow
- [ ] Test paywall enforcement
- [ ] Test error handling
- [ ] Test responsive design on mobile

#### 6. HTTPS
- [ ] Verify HTTPS is enabled
- [ ] Check SSL certificate is valid
- [ ] No mixed content warnings

#### 7. Custom Domain (Optional)
- [ ] Configure custom domain in Vercel
- [ ] Verify domain points to Vercel
- [ ] Test app on custom domain

---

## Summary

**Total Test Cases**: 50+

**Pass Criteria**:
- All authentication flows work correctly
- All analysis flows work correctly
- Paywall enforcement works correctly
- Error handling is graceful
- Responsive design works on all screen sizes
- App is deployed and accessible

**Notes**:
- Tests should be performed in order
- Each test should be documented with pass/fail status
- Any failures should be investigated and fixed
- Stripe integration will be added in future phase
