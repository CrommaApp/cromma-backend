const express = require('express');
const { User, Post } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: '',
        data: fullUserWithoutPassword,
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: '',
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send({
        statusCode: 401,
        status: 'fail',
        message: info.reason,
      });
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
            attributes: ['id'],
          },
        ],
      });
      return res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: '로그인에 성공했습니다.',
        data: fullUserWithoutPassword,
      });
    });
  })(req, res, next);
});

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
  try {
    const existUser = await User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (existUser) {
      return res.status(403).send({
        statusCode: 403,
        status: 'fail',
        message: '이미 사용 중인 아이디입니다.',
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      userId: req.body.userId,
      password: hashedPassword,
    });
    res.status(201).send({
      statusCode: 201,
      status: 'success',
      message: '회원가입에 성공했습니다.',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send({
    statusCode: 200,
    state: 'success',
    message: '로그아웃에 성공했습니다.',
  });
});

module.exports = router;
