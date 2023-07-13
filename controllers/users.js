const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then(users => {
      if(users.length  == 0) {
        return res.status(NOT_FOUND).send({ message: 'Пользователи не найдены' })
      }
      else(
        res.send({ users })
      )
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
        if(!user) {
          res.status(res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
        }
        else {
          res.send({ user });
        }
      })
    .catch(err => {
      console.log(err.name);
      if(err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
      }
      else if(err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' })
      }
      else{
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
}

const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => {
      if (name && about && avatar) {
        res.send({ user })
      }
      else {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
      }
    })
    .catch(err => {
      if(err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
      }
      else{
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => {
      res.send({ user })
    })
    .catch(err => {
      if(err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
      }
      else{
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => {
      res.send({ user })
    })
    .catch(err => {
      if(err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
      }
      else{
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUsers,
  updateUser,
  updateAvatarUser
}
