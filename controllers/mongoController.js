const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const saveChatHistory = async (chatHistory) => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const collection = client.db('mimerchat').collection('chats');

    // Add chatId and timestamp
    chatHistory.chatId = new ObjectId();
    chatHistory.timestamp = new Date();

    await collection.insertOne(chatHistory);
    console.log('Chat history saved successfully!');
  } catch (error) {
    console.error('Error occurred while saving chat history:', error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

module.exports = { saveChatHistory };
