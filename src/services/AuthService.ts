// Authentication service (Service Layer)

import { IAuthRepository } from '@/repositories/interfaces/IAuthRepository';
import { LocalStorageAuthRepository } from '@/repositories/LocalStorageAuthRepository';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export class AuthService {
  private authRepository: IAuthRepository;

  constructor(authRepository?: IAuthRepository) {
    // Default to local storage implementation, can be switched to AWS implementation in the future
    this.authRepository = authRepository || new LocalStorageAuthRepository();
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Business logic (if needed)
    const result = await this.authRepository.login(credentials);
    
    if (result.success && result.token) {
      // Additional processing on successful login
      this.setAuthToken(result.token);
    }
    
    return result;
  }

  // User registration
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Business logic (if needed)
    const result = await this.authRepository.register(credentials);
    
    if (result.success && result.token) {
      // Additional processing on successful registration
      this.setAuthToken(result.token);
    }
    
    return result;
  }

  // Logout
  async logout(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      await this.authRepository.logout(token);
      this.removeAuthToken();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const token = this.getAuthToken();
    if (!token) return null;
    
    return await this.authRepository.verifyToken(token);
  }

  // Check authentication status
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Update user information
  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return await this.authRepository.updateUser(id, data);
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<boolean> {
    return await this.authRepository.requestPasswordReset(email);
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    return await this.authRepository.resetPassword(token, newPassword);
  }

  // Token management (private methods)
  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ebis_auth_token', token);
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ebis_auth_token');
    }
    return null;
  }

  private removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ebis_auth_token');
    }
  }

  // Switch repository (for AWS migration)
  setRepository(repository: IAuthRepository): void {
    this.authRepository = repository;
  }
}

// Singleton instance
export const authService = new AuthService(); 