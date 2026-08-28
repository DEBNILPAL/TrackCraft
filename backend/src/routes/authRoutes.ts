import { Router, Response } from 'express';
import { AuthService } from '../services/authService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/signup
router.post('/signup', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full Name, Email, and Password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const result = await AuthService.register({ fullName, email, phone, password });
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and Password are required' });
    }

    const result = await AuthService.login({ email, password });
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message || 'Authentication failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({ success: true, data: { user: req.user } });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fullName, phone, avatarUrl } = req.body;

    const updatedUser = AuthService.updateProfile(userId, { fullName, phone, avatarUrl });
    return res.status(200).json({ success: true, data: { user: updatedUser } });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update profile' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    }

    await AuthService.changePassword(userId, currentPassword, newPassword);
    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Password update failed' });
  }
});

export default router;
