// authenticationHandler.js

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; //api KEY HEADER
  const validApiKey = process.env.APP_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  next();
};

module.exports = { checkApiKey };
