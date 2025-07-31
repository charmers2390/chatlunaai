const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// You can enable this later to serve the frontend
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });

  try {
    const completion = await openai.createChatCompletion({
      model: 'o4-mini-high',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI.' });
  }
});

app.listen(port, () => {
  console.log(`🟢 Server running at http://localhost:${port}`);
});
