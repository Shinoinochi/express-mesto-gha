const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const AccessDeniedError = require('../errors/access-denied-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (name && link && owner) {
        res.status(201).send({ card });
      } else {
        throw new BadRequestError('Ошибка ввода данных');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Неверный ID карточки');
      }
      if (owner !== String(card.owner)) {
        throw new AccessDeniedError('Нет доступа для удаления');
      } else {
        card.deleteOne();
      }
    })
    .then((deleted) => {
      res.send({ deleted });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Неверный ID карточки');
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Несуществующий ID карточки');
      }
      next(err);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Неверный ID карточки');
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Несуществующий ID карточки');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
