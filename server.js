require('dotenv').config();

const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;
const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY.trim(),
    })
  : null;
const SYSTEM_INSTRUCTION = `You are an expert business analyst. Analyze the stakeholder feedback provided as it relates to the problem and structure your response with the following sections:

1. PATTERNS: What themes appear across multiple sources? (3-5 bullets)
2. SURPRISES: Where sources disagree and what that might mean (3-5 bullets)
3. ASSUMPTIONS TO REVISIT: What assumptions were challenged or proven wrong? (3-5 bullets)
4. RED FLAGS: What concerns or risks surfaced? (3-5 bullets)
5. TOP 3 INSIGHTS: The most important takeaways for your problem (3-5 bullets)`;

app.use(express.json({ limit: '1mb' }));
app.use(express.static('.'));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, status: 'server-ready' });
});

app.post('/api/analyze-feedback', async (req, res) => {
  const { problem, feedbackRecords } = req.body || {};

  if (!problem || !problem.trim()) {
    return res.status(400).json({ error: 'Problem is required.' });
  }

    if (!groq) {
    console.error(
      'Missing GROQ_API_KEY. Ensure the project root has a valid .env file with GROQ_API_KEY=your_key_here.'
    );

    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured. Add it to your local .env file.',
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: SYSTEM_INSTRUCTION,
        },
        {
          role: 'user',
          content: `Problem to analyze:\n${problem}\n\nFeedback records:\n${JSON.stringify(
            feedbackRecords || [],
            null,
            2
          )}`,
        },
      ],
    });

    const analysis =
      completion.choices?.[0]?.message?.content ||
      'No analysis returned by Groq.';

    return res.json({ analysis });
  } catch (error) {
    console.error('Groq request failed:', error);

    return res.status(500).json({
      error: error.message || 'Failed to connect to the Groq API.',
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
