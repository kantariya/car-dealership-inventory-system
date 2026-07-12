import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { loginUser as loginApi, registerUser as registerApi } from '../services/authService';
import { USER_ROLES } from '../utils/constants';

const AuthContext = createContext(null);

function getStoredAuth() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (token && userStr) {
    try {
      return { token, user: JSON.parse(userStr) };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const stored = getStoredAuth();
  const [user, setUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(credentials);
      const userData = { email: data.email, name: data.name, role: data.role };
      setToken(data.token);
      setUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerApi(userData);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const value = useMemo(
    () => ({ user, token, loading, error, isAuthenticated, isAdmin, login, register, logout }),
    [user, token, loading, error, isAuthenticated, isAdmin, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
