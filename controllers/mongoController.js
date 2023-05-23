const saveChatHistory = async (message, auth0Id, email) => {
  try {
    await client.connect();

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
  } finally {
    await client.close();
  }
};
