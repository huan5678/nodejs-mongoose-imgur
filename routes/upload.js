const express = require('express');
const router = express.Router();
const uploadImgurController = require('../controllers/uploadImgur');
const {isAuthor} = require('../middleware/handleJWT');
const imageCheck = require('../utils/imageCheck');

router.post('/upload', isAuthor, imageCheck, uploadImgurController.uploadImgur);

module.exports = router;
