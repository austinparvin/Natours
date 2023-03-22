const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  allowCDNScripts,
  getMyTours,
} = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

router.use(allowCDNScripts);

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

module.exports = router;
