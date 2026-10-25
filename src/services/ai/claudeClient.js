const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-5-5';

/**
 * Call the Anthropic Messages API directly from the browser with the user's own key
 * and parse the JSON object in the reply.
 *
 * ⚠️ Keys entered in a browser are visible to that user only, but for a production
 * app you should proxy this through a Cloud Function so no key is ever client-side.
 */
export async function callClaudeJson({ system, prompt, apiKey }) {
  if (!apiKey) throw new Error('No API key configured.');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Claude API request failed (${response.status})`);
  }

  const data = await response.json();
  const text = data.content?.find((block) => block.type === 'text')?.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Claude did not return structured JSON.');
  return JSON.parse(match[0]);
}
