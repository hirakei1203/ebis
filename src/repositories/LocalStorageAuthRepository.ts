// ローカルストレージ認証リポジトリ（開発用実装）

import { IAuthRepository } from './interfaces/IAuthRepository';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export class LocalStorageAuthRepository implements IAuthRepository {
  private readonly USERS_KEY = 'ebis_users';
  private readonly SESSIONS_KEY = 'ebis_sessions';

  // ユーザーデータの初期化
  private initializeUsers(): void {
    if (typeof window === 'undefined') return;
    
    const existingUsers = localStorage.getItem(this.USERS_KEY);
    if (!existingUsers) {
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'demo@ebis.com',
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  private getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    
    this.initializeUsers();
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users).map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    })) : [];
  }

  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private hashPassword(password: string): string {
    // 実際の実装では bcrypt などを使用
    // ここでは簡単なハッシュ化（本番では使用しない）
    return btoa(password + 'ebis_salt');
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // 入力検証
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          message: 'Email and password are required',
          errors: {
            email: !credentials.email ? 'Email is required' : '',
            password: !credentials.password ? 'Password is required' : ''
          }
        };
      }

      const users = this.getUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: { email: 'User not found' }
        };
      }

      // デモ用：パスワードは 'password' または実際のハッシュ化されたパスワード
      const isValidPassword = credentials.password === 'password' || 
                             this.verifyPassword(credentials.password, credentials.password);

      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: { password: 'Invalid password' }
        };
      }

      // セッション作成
      const token = this.generateToken();
      const session = {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間
      };

      // セッション保存
      const sessions = JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '[]');
      sessions.push(session);
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));

      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // 入力検証
      const errors: Record<string, string> = {};
      
      if (!credentials.email) errors.email = 'Email is required';
      if (!credentials.password) errors.password = 'Password is required';
      if (!credentials.name) errors.name = 'Name is required';
      
      if (credentials.password && credentials.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (credentials.email && !emailRegex.test(credentials.email)) {
        errors.email = 'Invalid email format';
      }

      if (Object.keys(errors).length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors
        };
      }

      const users = this.getUsers();
      
      // 既存ユーザーチェック
      if (users.find(u => u.email === credentials.email)) {
        return {
          success: false,
          message: 'User already exists',
          errors: { email: 'Email is already registered' }
        };
      }

      // 新規ユーザー作成
      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(newUser);
      this.saveUsers(users);

      // 自動ログイン
      const loginResult = await this.login({
        email: credentials.email,
        password: credentials.password
      });

      return {
        success: true,
        user: newUser,
        token: loginResult.token,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration'
      };
    }
  }

  async logout(token: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '[]');
      const filteredSessions = sessions.filter((s: any) => s.token !== token);
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async verifyToken(token: string): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessions = JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '[]');
      const session = sessions.find((s: any) => s.token === token);
      
      if (!session || new Date(session.expiresAt) < new Date()) {
        return null;
      }

      const users = this.getUsers();
      return users.find(u => u.id === session.userId) || null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const users = this.getUsers();
      return users.find(u => u.id === id) || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) return null;

      users[userIndex] = {
        ...users[userIndex],
        ...data,
        updatedAt: new Date()
      };

      this.saveUsers(users);
      return users[userIndex];
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) return false;

      // 実際の実装では、メール送信処理を行う
      console.log(`Password reset requested for: ${email}`);
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // 実際の実装では、リセットトークンの検証を行う
      console.log(`Password reset with token: ${token}`);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }
} 