// Authentication repository interface (Repository Layer)

import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export interface IAuthRepository {
  // User authentication
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  
  // User registration
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  
  // Logout
  logout(token: string): Promise<void>;
  
  // Token verification
  verifyToken(token: string): Promise<User | null>;
  
  // Get user information
  getUserById(id: string): Promise<User | null>;
  
  // Update user information
  updateUser(id: string, data: Partial<User>): Promise<User | null>;
  
  // Password reset
  requestPasswordReset(email: string): Promise<boolean>;
  
  // Change password
  resetPassword(token: string, newPassword: string): Promise<boolean>;
} 