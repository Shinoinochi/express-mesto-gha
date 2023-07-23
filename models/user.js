const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');
const AuthError = require('../errors/auth-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальное длина поля name 2 символа'],
      maxlength: [30, 'Максимальная длина поля name 30 символов'],
      default: 'Уточка',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальное длина поля about 2 символа'],
      maxlength: [30, 'Максимальная длина поля about 30 символов'],
      default: 'Кря-кря',
    },
    avatar: {
      type: String,
      validate: {
        validator: (URL) => validator.isURL(URL),
        message: 'Некорректный URL',
      },
      default: 'https://kartinkin.net/uploads/posts/2022-02/1644904275_66-kartinkin-net-p-utochki-kartinki-78.jpg',
    },
    email: {
      type: String,
      unique: true,
      require: [true, 'Поле email должно быть заполнено'],
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      select: false,
      require: [true, 'Поле password должно быть заполнено'],
      minlength: [8, 'Минимальное длина поля password 8 символов'],
    },
  },
  { versionKey: false },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильная почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильная почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
