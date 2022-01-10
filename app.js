const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const db = require('./models');
const cors = require('cors');
const postRoute = require('./routes/post');
const postsRoute = require('./routes/posts');
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
    origin: ['http://localhost:3000', 'http://cromma.site'],
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

app.use('/post', postRoute);
app.use('/posts', postsRoute);
app.use('/user', userRoute);

app.listen(80, () => {
  console.log('서버 실행 중');
});
