const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальное длина поля name 2 символа'],
      maxlength: [30, 'Максимальная длина поля name 30 символов'],
      require: [true, 'Поле name должно быть заполнено'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальное длина поля about 2 символа'],
      maxlength: [30, 'Максимальная длина поля about 30 символов'],
      require: [true, 'Поле about должно быть заполнено'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (URL) => validator.isURL(URL),
        message: 'Некорректный URL',
      },
      require: [true, 'Поле avatar должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
