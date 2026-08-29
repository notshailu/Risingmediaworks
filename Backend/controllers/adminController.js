const AdminToken = require('../models/AdminToken');

// Save or Update Admin FCM Token
exports.saveAdminToken = async (req, res) => {
  try {
    const { token, deviceInfo } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const updatedToken = await AdminToken.findOneAndUpdate(
      { token },
      { 
        token, 
        deviceInfo: deviceInfo || req.headers['user-agent'] || 'Admin Browser', 
        lastUpdated: new Date() 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Admin token saved successfully', 
      data: updatedToken 
    });
  } catch (error) {
    console.error('Error saving admin token:', error);
    res.status(500).json({ success: false, message: 'Server error saving token', error: error.message });
  }
};

// Get All Active Admin Tokens
exports.getAdminTokens = async (req, res) => {
  try {
    const tokens = await AdminToken.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: tokens.length, data: tokens });
  } catch (error) {
    console.error('Error fetching admin tokens:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tokens', error: error.message });
  }
};

// Delete Admin Token
exports.deleteAdminToken = async (req, res) => {
  try {
    const { token } = req.body;
    await AdminToken.findOneAndDelete({ token });
    res.status(200).json({ success: true, message: 'Token removed successfully' });
  } catch (error) {
    console.error('Error deleting admin token:', error);
    res.status(500).json({ success: false, message: 'Server error deleting token', error: error.message });
  }
};
