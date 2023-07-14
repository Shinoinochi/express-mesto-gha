const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ae5c7281ea18f579667255'
  };

  next();
});

app.patch('/404', function(req, res){
  res.status(404).send({ message: 'Здесь ничего нет' });
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});