import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, source_lang, target_lang, tone } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    const translationPrompt = `Translate the following text from ${source_lang} to ${target_lang} with a ${tone} tone: "${text}"`;
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: translationPrompt }],
          max_tokens: 100,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const translation = response.data.choices[0].message.content.trim();
      res.status(200).json({ translation });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to get a valid response from OpenAI' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
