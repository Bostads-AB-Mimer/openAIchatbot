const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const chatRoutes = require('./routes/chat');
const chatHistoryRoutes = require('./routes/chatHistory');
const clearChatHistoryRoutes = require('./routes/clearChatHistory');

app.use(express.json());

app.use('/chat', chatRoutes);
app.use('/chatHistory', chatHistoryRoutes);
app.use('/clearChatHistory', clearChatHistoryRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
