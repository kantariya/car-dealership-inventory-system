import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

/* Mock the auth service module */
vi.mock('../../services/authService', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

import { loginUser, registerUser } from '../../services/authService';

/* Helper component to expose AuthContext values for testing */
function AuthConsumer() {
  const { user, token, isAuthenticated, isAdmin, login, register, logout, loading, error } = useAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="user-name">{user?.name || ''}</span>
      <span data-testid="user-email">{user?.email || ''}</span>
      <span data-testid="user-role">{user?.role || ''}</span>
      <span data-testid="token">{token || ''}</span>
      <span data-testid="error">{error || ''}</span>
      <button data-testid="login-btn" onClick={() => login({ email: 'test@test.com', password: 'password123' }).catch(() => {})}>Login</button>
      <button data-testid="register-btn" onClick={() => register({ email: 'new@test.com', password: 'password123', name: 'New User' }).catch(() => {})}>Register</button>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide default unauthenticated state', () => {
    renderWithProvider();

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
    expect(screen.getByTestId('user-name')).toHaveTextContent('');
    expect(screen.getByTestId('token')).toHaveTextContent('');
  });

  it('should login successfully and store token', async () => {
    const mockResponse = {
      token: 'jwt-token-123',
      email: 'test@test.com',
      name: 'Test User',
      role: 'USER',
    };
    loginUser.mockResolvedValueOnce(mockResponse);

    renderWithProvider();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@test.com');
    expect(screen.getByTestId('user-role')).toHaveTextContent('USER');
    expect(screen.getByTestId('token')).toHaveTextContent('jwt-token-123');
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
    expect(localStorage.getItem('token')).toBe('jwt-token-123');
  });

  it('should identify admin users correctly', async () => {
    const mockResponse = {
      token: 'admin-jwt-token',
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
    };
    loginUser.mockResolvedValueOnce(mockResponse);

    renderWithProvider();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('admin')).toHaveTextContent('true');
    });
    expect(screen.getByTestId('user-role')).toHaveTextContent('ADMIN');
  });

  it('should handle login errors', async () => {
    loginUser.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderWithProvider();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should register successfully', async () => {
    const mockResponse = {
      id: 1,
      email: 'new@test.com',
      name: 'New User',
      role: 'USER',
    };
    registerUser.mockResolvedValueOnce(mockResponse);

    renderWithProvider();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(registerUser).toHaveBeenCalledWith({
      email: 'new@test.com',
      password: 'password123',
      name: 'New User',
    });
  });

  it('should logout and clear state', async () => {
    const mockResponse = {
      token: 'jwt-token-123',
      email: 'test@test.com',
      name: 'Test User',
      role: 'USER',
    };
    loginUser.mockResolvedValueOnce(mockResponse);

    renderWithProvider();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('login-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    await user.click(screen.getByTestId('logout-btn'));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-name')).toHaveTextContent('');
    expect(screen.getByTestId('token')).toHaveTextContent('');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should restore session from localStorage on mount', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({
      email: 'stored@test.com',
      name: 'Stored User',
      role: 'USER',
    }));

    renderWithProvider();

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User');
    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
  });
});
