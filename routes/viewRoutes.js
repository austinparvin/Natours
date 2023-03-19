const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  allowCDNScripts,
} = require('../controllers/viewController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.use(allowCDNScripts);
router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour);
router.get('/login', getLoginForm);

module.exports = router;
