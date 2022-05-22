const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const {isAuthor} = require('../middleware/handleJWT');

router.get('/posts', isAuthor, postController.getAllPosts);

router.get('/post/:id', isAuthor, postController.getPostByID);

router.post('/post', isAuthor, postController.createPost);

router.delete('/posts', isAuthor, postController.deleteAllPost);

router.delete('/post/:id', isAuthor, postController.deletePostByID);

router.patch('/post/:id', isAuthor, postController.updatePostByID);

module.exports = router;
