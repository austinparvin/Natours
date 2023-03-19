const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  allowCDNScripts,
} = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);
router.use(allowCDNScripts);
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
