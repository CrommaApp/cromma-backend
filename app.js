const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const db = require('./models');
const cors = require('cors');
const keywordRoute = require('./routes/keyword');
const userRoute = require('./routes/user');
const passportConfig = require('./passport');
const hpp = require('hpp');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: 'https://crommaapp.github.io',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/keyword', keywordRoute);
app.use('/user', userRoute);

app.listen(3065, () => {
  console.log('서버 실행 중');
});
