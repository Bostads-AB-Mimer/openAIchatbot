const express = require('express');
const router = express.Router();
const mongoController = require('../controllers/mongoController');

router.get('/:auth0Id', async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const result = await mongoController.getChatHistory(auth0Id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error occurred while retrieving chat history:', error);
    res
      .status(500)
      .json({ message: 'Error occurred while retrieving chat history' });
  }
});

module.exports = router;
