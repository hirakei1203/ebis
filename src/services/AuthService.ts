// 認証サービス（Service Layer）

import { IAuthRepository } from '@/repositories/interfaces/IAuthRepository';
import { LocalStorageAuthRepository } from '@/repositories/LocalStorageAuthRepository';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export class AuthService {
  private authRepository: IAuthRepository;

  constructor(authRepository?: IAuthRepository) {
    // デフォルトはローカルストレージ実装、将来的にAWS実装に切り替え可能
    this.authRepository = authRepository || new LocalStorageAuthRepository();
  }

  // ログイン
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // ビジネスロジック（必要に応じて）
    const result = await this.authRepository.login(credentials);
    
    if (result.success && result.token) {
      // ログイン成功時の追加処理
      this.setAuthToken(result.token);
    }
    
    return result;
  }

  // ユーザー登録
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // ビジネスロジック（必要に応じて）
    const result = await this.authRepository.register(credentials);
    
    if (result.success && result.token) {
      // 登録成功時の追加処理
      this.setAuthToken(result.token);
    }
    
    return result;
  }

  // ログアウト
  async logout(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      await this.authRepository.logout(token);
      this.removeAuthToken();
    }
  }

  // 現在のユーザー取得
  async getCurrentUser(): Promise<User | null> {
    const token = this.getAuthToken();
    if (!token) return null;
    
    return await this.authRepository.verifyToken(token);
  }

  // 認証状態確認
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // ユーザー情報更新
  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return await this.authRepository.updateUser(id, data);
  }

  // パスワードリセット要求
  async requestPasswordReset(email: string): Promise<boolean> {
    return await this.authRepository.requestPasswordReset(email);
  }

  // パスワードリセット
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    return await this.authRepository.resetPassword(token, newPassword);
  }

  // トークン管理（プライベートメソッド）
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

  // リポジトリ切り替え（AWS移行時に使用）
  setRepository(repository: IAuthRepository): void {
    this.authRepository = repository;
  }
}

// シングルトンインスタンス
export const authService = new AuthService(); 