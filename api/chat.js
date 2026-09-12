// /api/chat.js
//
// Serverless proxy (Vercel) for the portfolio's assistant.
// Keeps the NVIDIA API key on the server — it never reaches the browser.
//
// SETUP
// 1. Deploy to Vercel: https://vercel.com/new
// 2. Settings -> Environment Variables:
//      NVIDIA_API_KEY = nvapi-xxxxxxxxxxxxxxxx
//    Optional:
//      NVIDIA_MODEL   = override the model without editing this file
// 3. Redeploy.
//
// Local testing:
//   npm i -g vercel && vercel dev
//   (put NVIDIA_API_KEY in .env.local — never commit it)
//
// GET /api/chat returns a health summary (no secrets) so the deployment can
// be diagnosed without sending a message.

const ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

// NVIDIA retires model ids periodically — meta/llama-3.1-8b-instruct vanished
// from the catalog and every request started failing with no clue why. Try a
// short chain so one retirement degrades instead of breaking the assistant.
// Current ids: https://integrate.api.nvidia.com/v1/models
const MODELS = [
  process.env.NVIDIA_MODEL,
  'nvidia/nemotron-nano-3-30b-a3b',
  'mistralai/mistral-7b-instruct-v0.3',
  'google/gemma-3-4b-it',
].filter(Boolean);

export default async function handler(req, res) {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: Boolean(apiKey),
      keyConfigured: Boolean(apiKey),
      models: MODELS,
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing NVIDIA_API_KEY env var.' });
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Only pass through what the model needs, and cap the history so a long
  // conversation can't be used to run up usage.
  const safeMessages = messages
    .filter((m) => m && typeof m.content === 'string' && ['user', 'assistant'].includes(m.role))
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!safeMessages.length) {
    return res.status(400).json({ error: 'no valid messages' });
  }

  const attempts = [];

  for (const model of MODELS) {
    try {
      const upstream = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: String(system || 'You are a helpful assistant.').slice(0, 4000) },
            ...safeMessages,
          ],
          max_tokens: 400,
          temperature: 0.5,
        }),
      });

      if (upstream.ok) {
        const data = await upstream.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) return res.status(200).json({ reply, model });
        attempts.push({ model, status: upstream.status, note: 'empty reply' });
        continue;
      }

      const detail = (await upstream.text()).slice(0, 300);
      console.error('NVIDIA error', model, upstream.status, detail);
      attempts.push({ model, status: upstream.status });

      // A bad key fails identically for every model — don't retry the chain.
      if (upstream.status === 401 || upstream.status === 403) {
        return res.status(502).json({
          error: 'The model provider rejected the API key.',
          upstreamStatus: upstream.status,
        });
      }
    } catch (err) {
      console.error('NVIDIA request threw', model, err);
      attempts.push({ model, status: 'network error' });
    }
  }

  // Everything failed — report enough to diagnose, without leaking the key.
  console.error('All models failed:', JSON.stringify(attempts));
  return res.status(502).json({
    error: 'Upstream model request failed.',
    attempts,
  });
}
