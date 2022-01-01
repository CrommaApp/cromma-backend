const express = require('express');
const dotenv = require('dotenv');
const db = require('./models');
const keywordRoute = require('./routes/keyword');

dotenv.config();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

const app = express();

app.use('/keyword', keywordRoute);

app.listen(3065);
