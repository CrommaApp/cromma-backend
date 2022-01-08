const express = require('express');
const Post = require('../models/post');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.user.id,
    });
    res.status(201).json({
      statusCode: 201,
      status: 'success',
      message: '',
      data: post,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send({
        statusCode: 404,
        status: 'fail',
        message: '존재하지 않는 게시글입니다.',
        data: null,
      });
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User,
          attributes: ['id', 'userId'],
        },
      ],
    });

    res.status(200).json({
      statusCode: 200,
      status: 'success',
      message: '',
      data: fullPost,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({
      statusCode: 200,
      status: 'success',
      message: '게시글 삭제 성공',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
