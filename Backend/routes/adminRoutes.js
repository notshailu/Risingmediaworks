const express = require('express');
const router = express.Router();
const { saveAdminToken, getAdminTokens, deleteAdminToken } = require('../controllers/adminController');
const { loginAdmin, verifyAdmin, changePassword } = require('../controllers/authController');

// Authentication Routes
router.post('/login', loginAdmin);
router.get('/verify', verifyAdmin);
router.post('/change-password', changePassword);

// FCM Token Routes
router.post('/token', saveAdminToken);
router.get('/tokens', getAdminTokens);
router.delete('/token', deleteAdminToken);

module.exports = router;
