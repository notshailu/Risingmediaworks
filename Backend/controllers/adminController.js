const AdminToken = require('../models/AdminToken');

// Save or Update Admin FCM Token
// @route   POST /api/admin/token
exports.saveAdminToken = async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const { token, deviceInfo } = req.body;
    
    if (!token) {
      console.warn(`[${timestamp}] [ADMIN FCM WARNING] Attempted token save without token parameter`);
      return res.status(400).json({ success: false, message: 'Token parameter is required' });
    }

    const device = deviceInfo || req.headers['user-agent'] || 'Admin Device';

    const updatedToken = await AdminToken.findOneAndUpdate(
      { token },
      { 
        token, 
        deviceInfo: device, 
        lastUpdated: new Date() 
      },
      { upsert: true, new: true }
    );

    console.log(`[${timestamp}] [ADMIN FCM STORE SUCCESS] FCM Token stored/updated for device: "${device}" (Token ID: ${updatedToken._id})`);

    res.status(200).json({ 
      success: true, 
      message: 'Admin FCM token saved successfully', 
      data: updatedToken 
    });
  } catch (error) {
    console.error(`[${timestamp}] [ADMIN FCM STORE ERROR] Failed to save admin token:`, error.message);
    res.status(500).json({ success: false, message: 'Server error saving token', error: error.message });
  }
};

// Get All Active Admin Tokens
// @route   GET /api/admin/tokens
exports.getAdminTokens = async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const tokens = await AdminToken.find().sort({ updatedAt: -1 });
    console.log(`[${timestamp}] [ADMIN FCM FETCH SUCCESS] Retrieved ${tokens.length} registered admin FCM tokens`);
    res.status(200).json({ success: true, count: tokens.length, data: tokens });
  } catch (error) {
    console.error(`[${timestamp}] [ADMIN FCM FETCH ERROR] Failed to fetch admin tokens:`, error.message);
    res.status(500).json({ success: false, message: 'Server error fetching tokens', error: error.message });
  }
};

// Delete Admin Token (Logout / Revoke Device)
// @route   DELETE /api/admin/token
exports.deleteAdminToken = async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const { token } = req.body;
    if (!token) {
      console.warn(`[${timestamp}] [ADMIN FCM DELETE WARNING] Delete request missing token payload`);
      return res.status(400).json({ success: false, message: 'Token payload is required' });
    }

    const deletedToken = await AdminToken.findOneAndDelete({ token });
    if (deletedToken) {
      console.log(`[${timestamp}] [ADMIN FCM DELETE SUCCESS] Deleted token for device: "${deletedToken.deviceInfo}"`);
      res.status(200).json({ success: true, message: 'FCM Token removed successfully' });
    } else {
      console.warn(`[${timestamp}] [ADMIN FCM DELETE NOT FOUND] Token string not found in DB`);
      res.status(404).json({ success: false, message: 'FCM Token not found in database' });
    }
  } catch (error) {
    console.error(`[${timestamp}] [ADMIN FCM DELETE ERROR] Failed to delete token:`, error.message);
    res.status(500).json({ success: false, message: 'Server error deleting token', error: error.message });
  }
};
