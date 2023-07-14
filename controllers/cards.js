const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner', 'likes')
    .then(cards => {
      if(cards.length  == 0) {
        return res.status(NOT_FOUND).send({ message: 'Карточки не найдены' })
      }
      else(
        res.send({ cards })
      )
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => {
      if(name && link && owner) {
        res.send({ card })
      }
      else {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
      }
    })
    .catch(() => {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if(!card) {
        res.status(NOT_FOUND).send({ message: 'Неверный ID карточки' })
      }
      else {
        res.send({ card })
      }
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неверно переданы данные' })
      }
      else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(card => {
      if(!card) {
        res.status(NOT_FOUND).send({ message: 'Неверный ID карточки' })
      }
      else {
        res.send({ card })
      }
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Несуществующий ID карточки' })
      }
      else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => {
      if(!card) {
        res.status(NOT_FOUND).send({ message: 'Неверный ID карточки' })
      }
      else {
        res.send({ card })
      }
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неверно переданы данные' })
      }
      else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' })
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}
