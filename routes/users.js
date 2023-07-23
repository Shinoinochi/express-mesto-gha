const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const BadRequestError = require('../errors/bad-request-err');
const {
  getUsers, getCurrentUser, updateUser, updateAvatarUser, getUser,
} = require('../controllers/users');

const validUrl = (url) => {
  if (validator.isUrl(url)) {
    return url;
  }
  throw new BadRequestError('Некоректный URL');
};

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
    avatar: Joi.string().required().custom(validUrl),
  }),
}), updateAvatarUser);

module.exports = router;
