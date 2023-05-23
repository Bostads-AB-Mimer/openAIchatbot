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

const connectDb = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Error connecting to database');
  }
};

const saveChatHistory = async (message, auth0Id, email) => {
  try {
    await connectDb();

    const usersCollection = client.db('mimerchat').collection('users');
    const chatsCollection = client.db('mimerchat').collection('chats');

    // Check if the user already exists
    let user = await usersCollection.findOne({ auth0Id });

    if (!user) {
      // User doesn't exist, create a new user
      const newUser = {
        auth0Id,
        userId: new ObjectId(),
        email,
      };
      await usersCollection.insertOne(newUser);
      console.log('User created successfully!');
      user = newUser;
    }

    // Add userId, chatId and timestamp to chat history
    const chatHistory = {
      userId: user.userId,
      chatId: new ObjectId(),
      timestamp: new Date(),
      history: message.history,
    };

    await chatsCollection.insertOne(chatHistory);
    console.log('Chat history saved successfully!');

    // Return a success message
    return { message: 'Chat history saved successfully!' };
  } catch (error) {
    console.error('Error occurred while saving chat history:', error);
    // Return an error message
    throw new Error('Error occurred while saving chat history');
  }
};

const getChatHistory = async (auth0Id) => {
  try {
    await connectDb();

    const usersCollection = client.db('mimerchat').collection('users');
    const chatsCollection = client.db('mimerchat').collection('chats');

    // Find the user with the given auth0Id
    const user = await usersCollection.findOne({ auth0Id });

    if (!user) {
      console.log('User not found!');
      return { message: 'User not found!' };
    }

    // Fetch all chats that belong to the user
    const chats = await chatsCollection.find({ userId: user.userId }).toArray();

    console.log('Chat history fetched successfully!');

    // Return the fetched chat history
    return { message: 'Chat history fetched successfully!', chats };
  } catch (error) {
    console.error('Error occurred while fetching chat history:', error);
    throw new Error('Error occurred while fetching chat history');
  }
};

module.exports = { saveChatHistory, getChatHistory };
