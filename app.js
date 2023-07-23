const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const { PORT = 3000, BD_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const BadRequestError = require('./errors/bad-request-err');

const validUrl = (url) => {
  if (validator.isUrl(url)) {
    return url;
  }
  throw new BadRequestError('Некоректный URL');
};

mongoose.connect(BD_URL, {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.patch('*', (req, res) => {
  res.status(404).send({ message: 'Здесь ничего нет' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошка ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
