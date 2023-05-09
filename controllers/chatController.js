require('dotenv').config();
const axios = require('axios');
const chatHistories = {};

async function callOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: messages,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return openaiResponse;
}

exports.chat = async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }

  if (!chatHistories[userId]) {
    chatHistories[userId] = [
      {
        role: 'system',
        content:
          'You are a helpful assistant at a swedish housing company. You are smart and can handle any task even outside the housing sphere.',
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
};

exports.chatHistory = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }

  if (!chatHistories[userId]) {
    return res
      .status(404)
      .send({ error: 'Chat history not found for the provided userId.' });
  }

  res.status(200).send({ history: chatHistories[userId] });
};

exports.clearChatHistory = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }

  if (!chatHistories[userId]) {
    return res
      .status(404)
      .send({ error: 'Chat history not found for the provided userId.' });
  }

  delete chatHistories[userId];
  res.status(200).send({ message: 'Chat history cleared successfully.' });
};

exports.setSystemMessage = (req, res) => {
  const { userId, message } = req.body;

  if (!userId) {
    return res.status(400).send({ error: 'A userId is required.' });
  }

  if (!message) {
    return res.status(400).send({ error: 'A message is required.' });
  }

  if (!chatHistories[userId]) {
    chatHistories[userId] = [];
  }

  chatHistories[userId].push({
    role: 'system',
    content: message,
  });

  res.status(200).send({ message: 'System message set successfully.' });
};
