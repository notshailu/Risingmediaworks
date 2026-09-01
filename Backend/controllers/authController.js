const crypto = require('crypto');
const AdminUser = require('../models/AdminUser');

const JWT_SECRET = process.env.JWT_SECRET || 'rising_media_works_admin_jwt_secret_key_2026';

// Safe require for bcryptjs with built-in crypto fallback
let bcrypt = null;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  console.warn('[AUTH SYSTEM]: bcryptjs module not installed on server, using native Node crypto fallback.');
}

// Safe require for jsonwebtoken with built-in HMAC fallback
let jwt = null;
try {
  jwt = require('jsonwebtoken');
} catch (e) {
  console.warn('[AUTH SYSTEM]: jsonwebtoken module not installed on server, using native Node HMAC fallback.');
}

// Password hashing helper (supports bcryptjs & native crypto pbkdf2)
const hashPassword = async (password) => {
  if (bcrypt) {
    return await bcrypt.hash(password, 10);
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `pbkdf2:${salt}:${hash}`;
};

// Password verification helper (supports bcryptjs & native crypto pbkdf2)
const comparePassword = async (password, storedHash) => {
  if (!storedHash) return false;

  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    if (bcrypt) {
      return await bcrypt.compare(password, storedHash);
    }
    console.error('[AUTH ERROR]: Password was hashed with bcryptjs but bcryptjs module is missing on server.');
    return false;
  }

  if (storedHash.startsWith('pbkdf2:')) {
    const parts = storedHash.split(':');
    const salt = parts[1];
    const originalHash = parts[2];
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }

  // Plaintext fallback safety check (if unhashed initial legacy password)
  return password === storedHash;
};

// JWT Token Generator helper (supports jsonwebtoken & native HMAC SHA256)
const signToken = (payload, expiresInDays = 7) => {
  if (jwt) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: `${expiresInDays}d` });
  }

  // Native HMAC JWT Fallback
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (expiresInDays * 24 * 60 * 60);
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

// JWT Token Verifier helper (supports jsonwebtoken & native HMAC SHA256)
const verifyToken = (token) => {
  if (jwt) {
    return jwt.verify(token, JWT_SECRET);
  }

  // Native HMAC JWT Verifier
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token structure');
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSig) throw new Error('Invalid token signature');

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token expired');
  }
  return payload;
};

// Seed initial default admin on server startup if none exists
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await hashPassword(defaultPassword);

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

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT Token (Strictly valid for 7 days)
    const token = signToken({ id: admin._id, username: admin.username, role: admin.role }, 7);

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
    const decoded = verifyToken(token);

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
    const decoded = verifyToken(token);

    const admin = await AdminUser.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    if (!newPassword || newPassword.length < 5) {
      return res.status(400).json({ message: 'New password must be at least 5 characters.' });
    }

    admin.password = await hashPassword(newPassword);
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
