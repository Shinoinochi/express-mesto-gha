const Card = require('../models/card');
const getCards = (req, res) => {
  Card.find({})
    .populate('owner', 'likes')
    .then(cards => res.send({ cards }))
    .catch(err => res.status(500).send({ message: err.message }));
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndRemove({ _id })
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

const likeCard = (req, res) => {
  const { _id } = req.body;
  console.log(req.params.cardId, req.user._id);
  Card.findByIdAndUpdate(_id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

const dislikeCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};


module.export = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}
