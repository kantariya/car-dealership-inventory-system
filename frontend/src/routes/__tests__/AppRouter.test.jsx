import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AppRouter from '../AppRouter';

let mockIsAuthenticated = false;
let mockIsAdmin = false;

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: mockIsAuthenticated,
      isAdmin: mockIsAdmin,
      user: mockIsAuthenticated ? { name: 'Test User', role: mockIsAdmin ? 'ADMIN' : 'USER' } : null,
      loading: false,
    }),
  };
});

// Mock the page components to avoid complex sub-renders
vi.mock('../../pages/LoginPage', () => ({ default: () => <div>Mocked LoginPage</div> }));
vi.mock('../../pages/RegisterPage', () => ({ default: () => <div>Mocked RegisterPage</div> }));
vi.mock('../../pages/DashboardPage', () => ({ default: () => <div>Mocked DashboardPage</div> }));
vi.mock('../../pages/VehiclesPage', () => ({ default: () => <div>Mocked VehiclesPage</div> }));
vi.mock('../../pages/admin/AdminVehiclesPage', () => ({ default: () => <div>Mocked AdminVehiclesPage</div> }));

describe('AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
    mockIsAdmin = false;
  });

  it('should render LoginPage for /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked LoginPage')).toBeInTheDocument();
  });

  it('should render RegisterPage for /register route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked RegisterPage')).toBeInTheDocument();
  });

  it('should redirect to /login for /dashboard route when unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked LoginPage')).toBeInTheDocument();
  });

  it('should render DashboardPage for /dashboard route when authenticated', () => {
    mockIsAuthenticated = true;
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked DashboardPage')).toBeInTheDocument();
  });

  it('should deny access to admin route when authenticated as standard user', () => {
    mockIsAuthenticated = true;
    mockIsAdmin = false;
    render(
      <MemoryRouter initialEntries={['/admin/vehicles']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked DashboardPage')).toBeInTheDocument();
  });

  it('should allow access to admin route when authenticated as admin user', () => {
    mockIsAuthenticated = true;
    mockIsAdmin = true;
    render(
      <MemoryRouter initialEntries={['/admin/vehicles']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked AdminVehiclesPage')).toBeInTheDocument();
  });
});
