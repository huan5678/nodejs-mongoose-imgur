const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {passwordRule} = require('../utils/passwordRule');

const userSchema = {
  email: {
    type: String,
    required: [true, 'email為必要資訊'],
    validate: {
      validator: function (v) {
        return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          v
        );
      },
      message: '請填寫正確 email 格式 name@domain.abc',
    },
    unique: true,
  },
  password: {
    type: String,
    minLength: [8, '密碼至少 8 個字'],
    required: [true, '密碼欄位，請確實填寫'],
    validate: {
      validator: function (v) {
        return passwordRule.test(v);
      },
      message: '密碼需符合至少有 1 個數字， 1 個大寫英文， 1 個小寫英文',
    },
  },
  name: {
    type: String,
    required: [true, '名稱為必要資訊'],
    minLength: [1, '名稱請大於 1 個字'],
    maxLength: [50, '名稱長度過長，最多只能 50 個字'],
  },
  photo: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'x'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  googleId: String,
  facebookId: String,
  lineId: String,
  githubId: String,
  isValidator: {
    type: Boolean,
    default: false,
  },
};

const User_Schema = new mongoose.Schema(userSchema, {
  versionKey: false,
});

User_Schema.pre('save', function () {
  const salt = bcrypt.genSaltSync(8);
  this.password = bcrypt.hashSync(this.password, salt);
});

const User = mongoose.model('User', User_Schema);

module.exports = User;
