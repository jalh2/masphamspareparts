const router = require('express').Router();
const userController = require('../controllers/userController');

// Public: list usernames for login dropdown
router.get('/usernames', userController.listUsernames);

router.post('/change-password', userController.changePassword);

module.exports = router;
