# Mimers openAI API

Mimers openAI API is a simple API built using Node.js and Express that serves as a wrapper for the OpenAI GPT-3.5 Turbo model. Users can interact with the chatbot via the API, and it includes the ability to manage chat history and set system messages.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [File Structure](#file-structure)

## Installation

1. Clone the repository to your local machine.
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file in the root directory and populate the required environment variables. Refer to the `.env.sample` file for reference.
4. Run `npm start` or `node index.js` to start the server.

## Usage

The API provides several endpoints to interact with the chatbot, manage chat history, and set system messages. You will need an API key to access these endpoints.

## API Endpoints

```
┌────────────────┐
│                │
│     Chatbot    │
│                │
└────────────────┘
        │
        ├─────> POST   /chat
        │
        ├─────> GET    /chatHistory
        │
        ├─────> POST   /clearChatHistory
        │
        └─────> POST   /setSystemMessage
```

- `/chat`: Send a message to the chatbot and receive a response. (POST)
- `/chatHistory`: Retrieve the chat history for a specific user. (GET)
- `/clearChatHistory`: Clear the chat history for a specific user. (POST)
- `/setSystemMessage`: Set a system message for a specific user. (POST)

## Environment Variables

Refer to the `.env.sample` file for the required environment variables:

- `APP_API_KEY`: The API key for users to consume the API.
- `OPENAI_API_KEY`: Your OpenAI API key.

## File Structure

- `index.js`: The main entry point of the application.
- `chatController.js`: The controller that handles chat-related functionality.
- `authenticationHandler.js`: Middleware to handle API key authentication.
- `routes`: Folder containing the route definitions for the API endpoints.
  - `chat.js`
  - `chatHistory.js`
  - `clearChatHistory.js`
  - `setSystemMessage.js`
- `public`: Folder containing static files served by the API.
  - `index.html`: The welcome page for the API.

Please make sure to update the code and environment variables as needed for your specific use case.

Built by David Lindblom: [https://github.com/lindblomdavid](https://github.com/lindblomdavid)
