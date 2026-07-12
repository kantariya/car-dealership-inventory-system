import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import MainLayout from '../MainLayout';

const mockLogout = vi.fn();
let mockUser = null;

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      logout: mockLogout,
      isAdmin: mockUser?.role === 'ADMIN',
      isAuthenticated: !!mockUser,
    }),
  };
});

function renderLayout() {
  return render(
    <MemoryRouter>
      <MainLayout>
        <div>Content Child</div>
      </MainLayout>
    </MemoryRouter>
  );
}

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  it('should render application branding and children content', () => {
    mockUser = { name: 'John Doe', email: 'john@test.com', role: 'USER' };
    renderLayout();

    expect(screen.getByText('AutoVault')).toBeInTheDocument();
    expect(screen.getByText('Content Child')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should show admin navigation links only to admin users', () => {
    mockUser = { name: 'Regular User', email: 'user@test.com', role: 'USER' };
    const { rerender } = renderLayout();

    expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument();

    mockUser = { name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' };
    rerender(
      <MemoryRouter>
        <MainLayout>
          <div>Content Child</div>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('should call logout function when clicking logout button', async () => {
    mockUser = { name: 'John Doe', email: 'john@test.com', role: 'USER' };
    renderLayout();
    const user = userEvent.setup();

    // In a responsive appBar/sidebar, there's a logout button
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();

    await user.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
