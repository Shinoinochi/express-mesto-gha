const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true
  },
  avatar: {
    type: String,
    require: true
  }
});
mongoose.model('user', userSchema);
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true
  },
  link: {
    type: String,
    require: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true
  },
  createdAt: {
    type: String,
    require: true
  }
});
mongoose.model('card', cardSchema);
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})