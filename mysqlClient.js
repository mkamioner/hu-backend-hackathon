const mysql = require('mysql');
const exportObj = {};
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'secret',
  database: process.env.MYSQL_DATABASE || 'GuessingGame',
  port: process.env.MYSQL_PORT || 3306
});

function connect() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => err ? reject(err) : resolve());
  });
}

exportObj.query = async function query(sql, args = []) {
  if (connection.state === 'disconnected') {
    await connect();
  }
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = exportObj;
