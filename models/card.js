const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальное длина поля name 2 символа'],
      maxlength: [30, 'Максимальная длина поля name 30 символов'],
      require: [true, 'Поле name должно быть заполнено'],
    },
    link: {
      type: String,
      validate: {
        validator: (URL) => validator.isURL(URL),
        message: 'Некорректный URL',
      },
      require: [true, 'Поле link должно быть заполнено'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: [true, 'Поле owner должно быть заполнено'],
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
