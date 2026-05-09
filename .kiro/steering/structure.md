# Project Structure

app/
  page.tsx          # Main single-page app (the only page)
  layout.tsx        # Root layout with dark theme
  api/
    analyse/
      route.ts      # POST endpoint — calls OpenRouter, returns 3 outputs

components/
  AnalyseInput.tsx  # Text input + URL input + submit button
  OutputSection.tsx # Displays one of the 3 outputs with copy button
  PaywallModal.tsx  # Shows when free user hits 2 analyses limit
  LoadingState.tsx  # Skeleton loader while AI generates

lib/
  supabase.ts       # Supabase client
  openrouter.ts     # OpenRouter API call + system prompts
  usage.ts          # Check and increment user analysis count

## Naming Conventions
- Components: PascalCase
- Files: camelCase
- API routes: kebab-case
- Database columns: snake_case

## Code Rules
- Every component under 150 lines
- No inline styles — Tailwind only
- Error states handled in every component
- Loading states on every async action