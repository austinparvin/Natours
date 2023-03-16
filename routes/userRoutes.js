const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup } = require('../controllers/authController');

router.post('/signup', signup);

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
