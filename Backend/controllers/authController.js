const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rising_media_works_admin_jwt_secret_key_2026';

// Seed initial default admin on server startup if none exists
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await AdminUser.create({
        username: defaultUsername,
        password: hashedPassword,
        name: 'Rising Media Admin',
        role: 'superadmin',
      });

      console.log(`[AUTH SEED] Default Admin Created: Username = '${defaultUsername}' | Initial Password = '${defaultPassword}'`);
    }
  } catch (error) {
    console.error('[AUTH SEED ERROR]:', error.message);
  }
};

// Admin Login Handler
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await AdminUser.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT Token (Strictly valid for 7 days)
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login authentication.' });
  }
};

// Verify Token Handler
const verifyAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, message: 'No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ valid: false, message: 'Admin user no longer exists.' });
    }

    res.json({
      valid: true,
      user: admin
    });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token.' });
  }
};

// Change Password Handler
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await AdminUser.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    if (!newPassword || newPassword.length < 5) {
      return res.status(400).json({ message: 'New password must be at least 5 characters.' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password.' });
  }
};

module.exports = {
  seedDefaultAdmin,
  loginAdmin,
  verifyAdmin,
  changePassword,
};
