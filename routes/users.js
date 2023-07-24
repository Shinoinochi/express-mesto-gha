const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getCurrentUser, updateUser, updateAvatarUser, getUser,
} = require('../controllers/users');

// eslint-disable-next-line no-useless-escape
const regex = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-z]{2,}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*[#]?/;

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
}), updateAvatarUser);

module.exports = router;
