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
  restrictTo,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect (require auth) for any route below
router.use(protect);
router.patch('/updatePassword', updatePassword);
router.get('/currentUser', getCurrentUser, getUser);
router.patch('/currentUser', updateCurrentUser);
router.delete('/currentUser', deleteCurrentUser);

router.use(restrictTo('admin'));
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
