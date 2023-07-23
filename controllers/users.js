const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('Пользователи не найдены');
      } (
        res.send({ users })
      );
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '30d' }),
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Пользователя нет в базе данных');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Некорректное id пользователя');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (email && password) {
        res.status(201).send({ user });
      } else {
        throw new BadRequestError('Ошибка ввода данных');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка ввода данных');
      } else if (err.code === 11000) {
        throw new ConflictError('Пользователь с такой почтой уже существует');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка ввода данных');
      }
    })
    .catch(next);
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка ввода данных');
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  console.log(req.params);
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Пользователя нет в базе данных');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Некоректный ID пользователя');
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatarUser,
  login,
  getUser,
};
