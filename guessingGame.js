const mysql = require('./mysqlClient');
const PubNub = require('pubnub');
const PUBNUB_CHANNEL = 'scoreboard-update';
const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY || 'pub-c-a187ce02-1604-498c-ae4b-25562b105b72',
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || 'sub-c-05cab6f0-43f1-11e8-a433-9e6b275e7b64'
});
const exportObj = {};

exportObj.createGame = async function createGame(name) {
  const magicNumber = Math.floor(Math.random() * 1000);
  let sql = 'INSERT INTO Games (playerName, magicNumber) VALUES (?, ?)';
  await mysql.query(sql, [name, magicNumber]);
  sql = 'SELECT LAST_INSERT_ID() AS gameId';
  const resultRows = await mysql.query(sql);
  const { gameId } = resultRows[0];
  return gameId;
};

exportObj.guess = async function guess(gameId, value) {
  let sql = 'UPDATE Games SET guesses = guesses + 1 WHERE gameId = ? AND isActive = 1';
  await mysql.query(sql, [gameId]);
  sql = 'SELECT magicNumber FROM Games WHERE gameId = ? AND isActive = 1';
  let resultRows = await mysql.query(sql, [gameId]);
  const { magicNumber } = resultRows[0];
  if (magicNumber > value) {
    return -1;
  }
  if (magicNumber < value) {
    return 1;
  }
  sql = 'UPDATE Games SET isActive = 0 WHERE gameId = ?';
  await mysql.query(sql, [gameId]);
  await pubnub.publish({
    channel: PUBNUB_CHANNEL,
    message: await exportObj.getScoreboard()
  });
  return 0;
};

exportObj.getScoreboard = async function getScoreboard() {
  const sql = 'SELECT playerName, guesses FROM Games WHERE isActive = 0 ORDER BY guesses LIMIT 5';
  const resultRows = await mysql.query(sql);
  return resultRows;
};

module.exports = exportObj;
