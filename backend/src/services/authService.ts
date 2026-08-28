import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JsonStorage } from '../storage/jsonStorage';
import { User, UserSanitized } from '../types';
import { CONFIG } from '../config';

const userStorage = new JsonStorage<User>('users');

export const sanitizeUser = (user: User): UserSanitized => {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{ user: UserSanitized; token: string }> {
    const emailNormalized = data.email.trim().toLowerCase();

    // Check existing email
    const existing = userStorage.filter((u) => u.email.toLowerCase() === emailNormalized);
    if (existing.length > 0) {
      throw new Error('An account with this email address already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: data.fullName.trim(),
      email: emailNormalized,
      phone: data.phone?.trim() || '',
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName.trim())}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userStorage.insert(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, CONFIG.JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user: sanitizeUser(newUser), token };
  }

  /**
   * Login user
   */
  static async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: UserSanitized; token: string }> {
    const emailNormalized = data.email.trim().toLowerCase();
    const users = userStorage.filter((u) => u.email.toLowerCase() === emailNormalized);

    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, CONFIG.JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user: sanitizeUser(user), token };
  }

  /**
   * Get user profile by ID
   */
  static getUserById(id: string): UserSanitized | null {
    const user = userStorage.getById(id);
    return user ? sanitizeUser(user) : null;
  }

  /**
   * Update Profile
   */
  static updateProfile(id: string, updates: { fullName?: string; phone?: string; avatarUrl?: string }): UserSanitized {
    const user = userStorage.getById(id);
    if (!user) throw new Error('User not found');

    const updated = userStorage.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) throw new Error('Failed to update user profile');
    return sanitizeUser(updated);
  }

  /**
   * Change Password
   */
  static async changePassword(id: string, currentPass: string, newPass: string): Promise<void> {
    const user = userStorage.getById(id);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) throw new Error('Current password is incorrect');

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPass, salt);

    userStorage.update(id, {
      passwordHash: newHash,
      updatedAt: new Date().toISOString(),
    });
  }
}
