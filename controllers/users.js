const User = require('../models/user');
const getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user}))
    .catch(err => res.status(500).send({ message: err.message }));
};
const getCurrentUser = (req, res) => {
  const { _id } = req.body;
  User.findById({ _id: _id })
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send({ message: err.message }));
}
const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user}))
    .catch(err => res.status(500).send({ message: err.message }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => res.send({ user }))
    .catch(err => res.status(500).send({ message: err.message }));
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => res.send({ data: user}))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUsers,
  updateUser,
  updateAvatarUser
}
