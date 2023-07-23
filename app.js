const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, BD_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect(BD_URL, {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

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
