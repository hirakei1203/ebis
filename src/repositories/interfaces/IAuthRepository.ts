// 認証リポジトリのインターフェース（Repository Layer）

import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export interface IAuthRepository {
  // ユーザー認証
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  
  // ユーザー登録
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  
  // ログアウト
  logout(token: string): Promise<void>;
  
  // トークン検証
  verifyToken(token: string): Promise<User | null>;
  
  // ユーザー情報取得
  getUserById(id: string): Promise<User | null>;
  
  // ユーザー情報更新
  updateUser(id: string, data: Partial<User>): Promise<User | null>;
  
  // パスワードリセット
  requestPasswordReset(email: string): Promise<boolean>;
  
  // パスワード変更
  resetPassword(token: string, newPassword: string): Promise<boolean>;
} 