// /api/chat.js
//
// Serverless function (Vercel-style: place in /api and deploy).
// Keeps your NVIDIA API key on the server — it never reaches the browser.
//
// SETUP:
// 1. Deploy this project to Vercel (free): https://vercel.com/new
// 2. In your Vercel project settings -> Environment Variables, add:
//      NVIDIA_API_KEY = nvapi-xxxxxxxxxxxxxxxx
// 3. Redeploy. The chat widget on your site will now work automatically.
//
// Local testing:
//   npm i -g vercel
//   vercel dev
//   (create a .env.local file with NVIDIA_API_KEY=nvapi-... — do NOT commit it)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing NVIDIA_API_KEY env var.' });
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const payload = {
      // Swap this for any model ID from https://build.nvidia.com/models
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: system || 'You are a helpful assistant.' },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.5,
    };

    const nvRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!nvRes.ok) {
      const errText = await nvRes.text();
      console.error('NVIDIA API error:', nvRes.status, errText);
      return res.status(502).json({ error: 'Upstream model request failed.' });
    }

    const data = await nvRes.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat proxy error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}