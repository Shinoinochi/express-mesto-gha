const router = require('express').Router();
const { getUsers, createUsers, getCurrentUser, updateUser, updateAvatarUser } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUsers);
router.get('/:userId', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);
module.exports = router;