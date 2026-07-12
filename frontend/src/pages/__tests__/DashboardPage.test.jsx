import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import DashboardPage from '../DashboardPage';

// Mock the vehicle service
vi.mock('../../services/vehicleService', () => ({
  getAllVehicles: vi.fn(),
  purchaseVehicle: vi.fn(),
}));

import { getAllVehicles, purchaseVehicle } from '../../services/vehicleService';

const mockVehicles = [
  { id: 1, make: 'Tesla', model: 'Model S', category: 'ELECTRIC', price: 89990, quantity: 5 },
  { id: 2, make: 'Ford', model: 'F-150', category: 'TRUCK', price: 45000, quantity: 0 },
];

function renderDashboard() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading skeleton or spinner initially', async () => {
    // Return a promise that doesn't resolve immediately
    getAllVehicles.mockReturnValue(new Promise(() => {}));
    renderDashboard();

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should fetch and display all available vehicles', async () => {
    getAllVehicles.mockResolvedValueOnce(mockVehicles);
    renderDashboard();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    // Check vehicle card contents
    expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('$89,990')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();

    expect(screen.getByText('Ford F-150')).toBeInTheDocument();
    expect(screen.getByText('Truck')).toBeInTheDocument();
    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('should enable purchase button when quantity > 0 and call purchase API on click', async () => {
    getAllVehicles.mockResolvedValueOnce([mockVehicles[0]]); // Tesla (qty: 5)
    const updatedTesla = { ...mockVehicles[0], quantity: 4 };
    purchaseVehicle.mockResolvedValueOnce(updatedTesla);

    renderDashboard();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).toBeEnabled();

    await user.click(purchaseBtn);

    expect(purchaseVehicle).toHaveBeenCalledWith(1);
    await waitFor(() => {
      // Stock quantity should be updated to 4 in stock
      expect(screen.getByText('4 in stock')).toBeInTheDocument();
    });
  });

  it('should disable purchase button and show out of stock when quantity is 0', async () => {
    getAllVehicles.mockResolvedValueOnce([mockVehicles[1]]); // Ford (qty: 0)
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Ford F-150')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /sold out/i });
    expect(purchaseBtn).toBeDisabled();
  });

  it('should handle API errors when fetching vehicles', async () => {
    getAllVehicles.mockRejectedValueOnce(new Error('Failed to load vehicles'));
    renderDashboard();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/failed to load vehicles/i)).toBeInTheDocument();
  });

  it('should show error notification if purchase fails', async () => {
    getAllVehicles.mockResolvedValueOnce([mockVehicles[0]]); // Tesla (qty: 5)
    purchaseVehicle.mockRejectedValueOnce({
      response: { data: { message: 'Out of stock' } },
    });

    renderDashboard();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    await user.click(purchaseBtn);

    await waitFor(() => {
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    });
    // Check that quantity is still 5
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
  });
});
