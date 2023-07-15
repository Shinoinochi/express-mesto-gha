const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { PORT = 3000, BD_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
const helmet = require('helmet');

mongoose.connect(BD_URL, {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ae5c7281ea18f579667255'
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.patch('*', function(req, res){
  res.status(404).send({ message: 'Здесь ничего нет' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});