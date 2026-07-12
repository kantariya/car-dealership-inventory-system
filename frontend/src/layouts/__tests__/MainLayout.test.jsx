import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../context/AuthContext';
import MainLayout from '../MainLayout';
import theme from '../../theme';

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
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <MainLayout>
          <div>Content Child</div>
        </MainLayout>
      </MemoryRouter>
    </ThemeProvider>
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

    expect(screen.getAllByText('AutoVault')[0]).toBeInTheDocument();
    expect(screen.getByText('Content Child')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should show admin navigation links only to admin users', () => {
    mockUser = { name: 'Regular User', email: 'user@test.com', role: 'USER' };
    const { rerender } = renderLayout();

    expect(screen.queryAllByRole('link', { name: /admin/i })).toHaveLength(0);

    mockUser = { name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' };
    rerender(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <MainLayout>
            <div>Content Child</div>
          </MainLayout>
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getAllByRole('link', { name: /admin/i })[0]).toBeInTheDocument();
  });

  it('should call logout function when clicking logout button', async () => {
    mockUser = { name: 'John Doe', email: 'john@test.com', role: 'USER' };
    renderLayout();
    const user = userEvent.setup();

    // Click profile menu button first to open the menu
    const profileBtn = screen.getByTestId('profile-menu-button');
    expect(profileBtn).toBeInTheDocument();
    await user.click(profileBtn);

    // Get logout menuitem from the open menu
    const logoutMenuItem = screen.getByRole('menuitem', { name: /logout/i });
    expect(logoutMenuItem).toBeInTheDocument();

    await user.click(logoutMenuItem);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
