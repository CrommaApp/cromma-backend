const express = require('express');
const Keyword = require('../models/keyword');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const keyword = await Keyword.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    res.status(201).json({
      statusCode: 201,
      status: 'success',
      message: '',
      data: keyword,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
