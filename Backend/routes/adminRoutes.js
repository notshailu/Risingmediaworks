const express = require('express');
const router = express.Router();
const { saveAdminToken, getAdminTokens, deleteAdminToken } = require('../controllers/adminController');

router.post('/token', saveAdminToken);
router.get('/tokens', getAdminTokens);
router.delete('/token', deleteAdminToken);

module.exports = router;
