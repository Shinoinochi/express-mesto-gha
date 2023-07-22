const router = require('express').Router();
const {
  getUsers, getCurrentUser, updateUser, updateAvatarUser, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
