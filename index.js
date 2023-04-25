// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const path = require('path');
const cors = require('cors');

const chatRoutes = require('./routes/chat');
const chatHistoryRoutes = require('./routes/chatHistory');
const clearChatHistoryRoutes = require('./routes/clearChatHistory');
const setSystemMessageRoutes = require('./routes/setSystemMessage');

app.use(express.json());


app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import the middleware function from authenticationHandler.js
const { checkApiKey } = require('./middleware/authenticationHandler');

// Add middleware to all routes, except the root route
app.use('/chat', checkApiKey, chatRoutes);
app.use('/chatHistory', checkApiKey, chatHistoryRoutes);
app.use('/clearChatHistory', checkApiKey, clearChatHistoryRoutes);
app.use('/setSystemMessage', checkApiKey, setSystemMessageRoutes);

app.listen(port, () => {
  console.log(`Server is running`);
});
