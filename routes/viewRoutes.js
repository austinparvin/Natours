const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  allowCDNScripts
} = require('../controllers/viewController');

const router = express.Router();

router.use(allowCDNScripts);
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
