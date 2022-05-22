const Post = require('../models/post');
const User = require('../models/user');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const postController = {
  getAllPosts: handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q = req.query.q !== undefined ? {content: new RegExp(req.query.q)} : {};
    q.user = req.user.id;
    const getAllPosts = await Post.find(q)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(timeSort);
    successHandle(res, '成功取得所有貼文', getAllPosts);
  }),
  getPostByID: handleErrorAsync(async (req, res, next) => {
    const {id} = req.params;
    if (typeof id === undefined || id === null || id.trim() === '') {
      return appError(404, '請正確的帶入貼文的 id', next);
    }
    const post = await Post.findById(id).populate({
      path: 'user',
      select: 'name photo',
    });
    successHandle(res, '成功取得該貼文', post);
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
    const data = req.body;
    if (typeof data.content === undefined || data.content === null || data.content?.trim() === '') {
      return appError(400, '請正確填寫內容欄位，內容欄位不得為空', next);
    }
    data.content = data.content?.trim();
    const user = req.user.id;
    data.user = user;
    await Post.create(data);
    const getAllPosts = await Post.find({user}).populate({
      path: 'user',
      select: 'name photo',
    });
    successHandle(res, '成功新增一則貼文', getAllPosts);
  }),
  updatePostByID: handleErrorAsync(async (req, res, next) => {
    const {id} = req.params;
    const data = req.body;
    if (typeof id === undefined || id === null || id.trim() === '') {
      return appError(404, '請正確的帶入貼文的 id', next);
    }
    const postId = await Post.findById(id).exec();
    if (!postId) {
      return appError(404, '請確認貼文 id 是否正確', next);
    }
    if (typeof data.content === undefined || data.content === null || data.content?.trim() === '') {
      return appError(400, '請正確填寫內容欄位，內容欄位不得為空', next);
    }
    data.content = data.content?.trim();
    await Post.findByIdAndUpdate(id, data);
    const user = req.user.id;
    const getAllPosts = await Post.find({user: user}).populate({
      path: 'user',
      select: 'name photo',
    });
    console.log(getAllPosts);
    successHandle(res, '成功更新一則貼文', getAllPosts);
  }),
  deleteAllPost: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    await Post.deleteMany({user});
    const getAllPosts = await Post.find({user});
    successHandle(res, '成功刪除全部貼文', getAllPosts);
  }),
  deletePostByID: handleErrorAsync(async (req, res, next) => {
    const {id} = req.params;
    if (typeof id === undefined || id === null || id.trim() === '') {
      return appError(404, '請正確的帶入貼文的 id', next);
    }

    const postId = Post.findById(id);
    if (!postId) {
      return appError(404, '請確認貼文 id 是否正確', next);
    }

    await Post.findByIdAndDelete(id);
    const user = req.user.id;
    const getAllPosts = await Post.find({user}).populate({
      path: 'user',
      select: 'name photo',
    });
    successHandle(res, '成功刪除該則貼文', getAllPosts);
  }),
};

module.exports = postController;
