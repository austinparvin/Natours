const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
  getCurrentUser,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);

router.get('/currentUser', protect, getCurrentUser, getUser);
router.patch('/currentUser', protect, updateCurrentUser);
router.delete('/currentUser', protect, deleteCurrentUser);

// prettier-ignore
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// prettier-ignore
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
