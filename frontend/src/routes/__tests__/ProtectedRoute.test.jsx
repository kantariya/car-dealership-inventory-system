import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

vi.mock('../../services/authService', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

function ProtectedContent() {
  return <div>Protected Content</div>;
}

function LoginRedirect() {
  return <div>Login Page</div>;
}

function renderWithRoute({ initialEntries = ['/protected'], authenticated = false } = {}) {
  if (authenticated) {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({
      email: 'test@test.com',
      name: 'Test',
      role: 'USER',
    }));
  }

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRedirect />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should redirect to login when user is not authenticated', () => {
    renderWithRoute({ authenticated: false });

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    renderWithRoute({ authenticated: true });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
