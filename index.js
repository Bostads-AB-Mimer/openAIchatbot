const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const chatHistories = {};

async function callOpenAI(messages) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: messages,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  return response;
}

app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }

  if (!chatHistories[userId]) {
    chatHistories[userId] = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
    ];
  }

  if (message && message.trim().length > 0) {
    chatHistories[userId].push({
      role: 'user',
      content: message,
    });

    const openAIResponse = await callOpenAI(chatHistories[userId]);

    if (openAIResponse.status === 200) {
      const assistantMessage =
        openAIResponse.data.choices[0].message.content.trim();
      chatHistories[userId].push({
        role: 'assistant',
        content: assistantMessage,
      });
      res.status(200).send({ message: assistantMessage });
    } else {
      res
        .status(openAIResponse.status)
        .send({ error: openAIResponse.statusText });
    }
  } else {
    res.status(400).send({ error: 'A message is required.' });
  }
});

app.get('/chatHistory', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }
  res.status(200).send(chatHistories[userId] || []);
});

app.post('/clearChatHistory', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }
  if (chatHistories[userId]) {
    chatHistories[userId].length = 0;
    res.status(200).send({ message: 'Chat history cleared.' });
  } else {
    res
      .status(404)
      .send({ error: 'No chat history found for the specified userId.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
