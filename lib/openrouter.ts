/**
 * OpenRouter API Integration
 * Handles AI analysis calls with fallback model support
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model configuration with fallback chain (only verified free models)
// Using openrouter/free as primary (auto-selects from available free models)
// Then specific fallbacks for reliability
const PRIMARY_MODEL = 'openrouter/free';
const FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'baidu/cobuddy:free',
];

// All models to try in order
const ALL_MODELS = [PRIMARY_MODEL, ...FALLBACK_MODELS];

// System prompt that instructs AI to return three sections
const SYSTEM_PROMPT = `You are a brutal, honest SaaS conversion expert who has helped 500+ solo founders get their first paying customer. You speak directly, founder-to-founder. No corporate language. No generic advice.

When given a landing page URL or product description, you return EXACTLY three sections with these EXACT headers:

## WHY YOU'RE GETTING ZERO CONVERSIONS
List exactly 5 specific reasons. Each reason must:
- Reference something specific from what they described
- Explain the psychological reason it is failing
- Be under 30 words
- Start with a number (1. 2. 3. 4. 5.)

## YOUR REDDIT LAUNCH POST
Write a complete Reddit post for r/SaaS or r/indiehackers. Rules:
- Open with a personal story or pain point (NOT "I built X")
- Second paragraph: the problem you solve, one sentence
- Third paragraph: what makes it different, specific
- End with soft CTA: link in comments, not in post body
- Total length: 150-200 words
- Tone: honest, slightly vulnerable, zero marketing speak

## YOUR 3-EMAIL OUTREACH SEQUENCE
Write 3 emails. Each email:
- Subject line on first line starting with "Subject:"
- Body under 80 words
- Conversational, sounds like a human not a marketer
- Email 1: introduce the problem you solve
- Email 2: social proof or specific outcome (3 days later)
- Email 3: last follow up, direct ask (5 days later)

Return ONLY these three sections. No preamble. No explanation. No "here are your results". Start directly with ## WHY YOU'RE GETTING ZERO CONVERSIONS`;

// Type definitions
export interface AnalysisOutput {
  conversions: string;
  reddit: string;
  emails: string;
}

/**
 * Call OpenRouter API with automatic fallback on rate limit
 * @param userInput - The user's input (landing page URL or product description)
 * @returns Analysis output with three sections
 */
export async function callOpenRouter(userInput: string): Promise<AnalysisOutput> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  if (!userInput || userInput.trim().length === 0) {
    throw new Error('User input cannot be empty');
  }

  // Try each model in order until one succeeds
  let lastError: any = null;

  for (const model of ALL_MODELS) {
    try {
      console.log(`Attempting analysis with model: ${model}`);
      return await callOpenRouterWithModel(model, userInput);
    } catch (error: any) {
      lastError = error;

      // If it's a 429 (rate limit), try the next model
      if (error.status === 429) {
        console.warn(`Model ${model} rate limited, trying next fallback...`);
        continue;
      }

      // For other errors, also try next model
      console.warn(`Model ${model} failed: ${error.message}, trying next fallback...`);
      continue;
    }
  }

  // All models failed
  throw new Error(
    `All models failed. Last error: ${lastError?.message || 'Unknown error'}. Please try again later.`
  );
}

/**
 * Internal function to call OpenRouter with a specific model
 * @param model - The model to use
 * @param userInput - The user's input
 * @returns Analysis output with three sections
 */
async function callOpenRouterWithModel(
  model: string,
  userInput: string
): Promise<AnalysisOutput> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://firstpaying.com',
        'X-Title': 'FirstPaying',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limit error
    if (response.status === 429) {
      const error = new Error('Rate limit exceeded');
      (error as any).status = 429;
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    const content = data.choices[0].message.content;

    // Parse the response into three sections
    const sections = parseResponse(content);

    return sections;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Analysis took too long (max 30 seconds)');
    }
    throw error;
  }
}

/**
 * Parse the API response into three sections
 * @param content - The raw response content
 * @returns Parsed analysis output
 */
function parseResponse(content: string): AnalysisOutput {
  // Split by ## headers to get three sections
  const conversionMatch = content.match(/## WHY YOU'RE GETTING ZERO CONVERSIONS\n([\s\S]*?)(?=## YOUR REDDIT LAUNCH POST|$)/);
  const redditMatch = content.match(/## YOUR REDDIT LAUNCH POST\n([\s\S]*?)(?=## YOUR 3-EMAIL OUTREACH SEQUENCE|$)/);
  const emailsMatch = content.match(/## YOUR 3-EMAIL OUTREACH SEQUENCE\n([\s\S]*?)$/);

  if (!conversionMatch || !redditMatch || !emailsMatch) {
    throw new Error(
      'API response did not contain all three required sections with correct headers'
    );
  }

  const conversions = conversionMatch[1].trim();
  const reddit = redditMatch[1].trim();
  const emails = emailsMatch[1].trim();

  if (!conversions || !reddit || !emails) {
    throw new Error('One or more sections are empty');
  }

  return {
    conversions,
    reddit,
    emails,
  };
}

export { SYSTEM_PROMPT, PRIMARY_MODEL, FALLBACK_MODELS, ALL_MODELS };
