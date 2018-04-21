const express = require('express');
const bodyParser = require('body-parser');
const guessingGame = require('./guessingGame');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/newGame', async (req, res) => {
  const name = req.body.name || 'unknown';
  const gameId = await guessingGame.createGame(name);
  res.json({ gameId });
});

app.post('/guess', async (req, res) => {
  const gameId = req.body.gameId;
  const value = req.body.value;
  const result = await guessingGame.guess(gameId, value);
  res.json({ result });
});

app.get('/scoreboard', async (req, res) => {
  const scoreboard = await guessingGame.getScoreboard();
  res.json(scoreboard);
});

app.get('/pubnubCreds', (req, res) => {
  res.json({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.log(`Running on port ${PORT}`);
});
