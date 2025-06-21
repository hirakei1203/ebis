'use client';

// Authentication context (Presentation Layer)

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/services/AuthService';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';

// Action definitions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Reducer
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

// Context type definition
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on initialization
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

  // Login
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

  // User registration
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

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state even if logout fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user information
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

  // Clear error
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

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 