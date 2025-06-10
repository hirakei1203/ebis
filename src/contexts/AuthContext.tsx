'use client';

// 認証コンテキスト（Presentation Layer）

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/services/AuthService';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';

// アクション定義
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// 初期状態
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// リデューサー
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

// コンテキスト型定義
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

// コンテキスト作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初期化時に認証状態をチェック
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const user = await authService.getCurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    checkAuthStatus();
  }, []);

  // ログイン
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await authService.login(credentials);

      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message || 'Login failed' });
        return { 
          success: false, 
          message: result.message,
          errors: result.errors 
        };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // ユーザー登録
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await authService.register(credentials);

      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message || 'Registration failed' });
        return { 
          success: false, 
          message: result.message,
          errors: result.errors 
        };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      // ログアウトは失敗してもローカル状態をクリア
      dispatch({ type: 'LOGOUT' });
    }
  };

  // ユーザー情報更新
  const updateUser = async (data: Partial<User>) => {
    try {
      if (!state.user) return false;

      const updatedUser = await authService.updateUser(state.user.id, data);
      if (updatedUser) {
        dispatch({ type: 'SET_USER', payload: updatedUser });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user failed:', error);
      return false;
    }
  };

  // エラークリア
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// カスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 