const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');
const AuthError = require('../errors/auth-err');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: [true, 'Поле email должно быть заполнено'],
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    name: {
      type: String,
      minlength: [2, 'Минимальное длина поля name 2 символа'],
      maxlength: [30, 'Максимальная длина поля name 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальное длина поля about 2 символа'],
      maxlength: [30, 'Максимальная длина поля about 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (URL) => validator.isURL(URL),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    password: {
      type: String,
      select: false,
      require: [true, 'Поле password должно быть заполнено'],
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
