const express = require('express');
const router = express.Router();
const mongoController = require('../controllers/mongoController');

router.post('/', async (req, res) => {
  try {
    const { auth0Id, email, message } = req.body.chatHistory;
    const result = await mongoController.saveChatHistory(
      message,
      auth0Id,
      email
    );
    res.status(200).json(result);
  } catch (error) {
    console.error('Error occurred while saving chat history:', error);
    res
      .status(500)
      .json({ message: 'Error occurred while saving chat history' });
  }
});

module.exports = router;
