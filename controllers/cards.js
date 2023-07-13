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
    .catch(err => {
      res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => {
      res.send({ card })
    })
    .catch(err => {
      res.status(BAD_REQUEST).send({ message: 'Ошибка ввода данных' })
    });
};

const deleteCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndRemove({ _id })
    .then(card => res.send({ card }))
    .catch(err => res.status(SERVER_ERROR).send({ message: err.message }));
};

const likeCard = (req, res) => {
  const { _id } = req.body;
  console.log(req.params.cardId, req.user._id);
  Card.findByIdAndUpdate(_id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(card => res.send({ card }))
    .catch(err => res.status(SERVER_ERROR).send({ message: err.message }));
};

const dislikeCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => res.send({ card }))
    .catch(err => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}
