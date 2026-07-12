import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import VehiclesPage from '../VehiclesPage';

// Mock the vehicle service
vi.mock('../../services/vehicleService', () => ({
  searchVehicles: vi.fn(),
  purchaseVehicle: vi.fn(),
}));

import { searchVehicles, purchaseVehicle } from '../../services/vehicleService';

const mockVehicles = [
  { id: 1, make: 'Tesla', model: 'Model 3', category: 'SEDAN', price: 42990, quantity: 2 },
  { id: 2, make: 'Toyota', model: 'RAV4', category: 'SUV', price: 32000, quantity: 4 },
];

function renderVehiclesPage() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('VehiclesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search filters: search input, category select, min/max price', async () => {
    searchVehicles.mockResolvedValueOnce([]);
    renderVehiclesPage();

    await waitFor(() => {
      expect(searchVehicles).toHaveBeenCalled();
    });

    expect(screen.getByLabelText(/search make or model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('should fetch all vehicles on initial mount with empty search', async () => {
    searchVehicles.mockResolvedValueOnce(mockVehicles);
    renderVehiclesPage();

    await waitFor(() => {
      expect(searchVehicles).toHaveBeenCalledWith({
        make: '',
        model: '',
        category: '',
        minPrice: '',
        maxPrice: '',
      });
    });

    expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    expect(screen.getByText('Toyota RAV4')).toBeInTheDocument();
  });

  it('should filter vehicles by criteria when search button is clicked', async () => {
    searchVehicles.mockResolvedValueOnce(mockVehicles);
    renderVehiclesPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(searchVehicles).toHaveBeenCalled();
    });

    // Enter search filters
    await user.type(screen.getByLabelText(/search make or model/i), 'Tesla');
    await user.type(screen.getByLabelText(/min price/i), '40000');
    await user.type(screen.getByLabelText(/max price/i), '90000');

    searchVehicles.mockResolvedValueOnce([mockVehicles[0]]);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(searchVehicles).toHaveBeenLastCalledWith({
      make: 'Tesla',
      model: 'Tesla', // both make and model mapped from the single search input for simple UI
      category: '',
      minPrice: '40000',
      maxPrice: '90000',
    });

    await waitFor(() => {
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
      expect(screen.queryByText('Toyota RAV4')).not.toBeInTheDocument();
    });
  });

  it('should reset search filters when reset button is clicked', async () => {
    searchVehicles.mockResolvedValue(mockVehicles);
    renderVehiclesPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(searchVehicles).toHaveBeenCalled();
    });

    const searchInput = screen.getByLabelText(/search make or model/i);
    await user.type(searchInput, 'Tesla');
    expect(searchInput).toHaveValue('Tesla');

    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(searchInput).toHaveValue('');
    expect(searchVehicles).toHaveBeenLastCalledWith({
      make: '',
      model: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  });

  it('should allow purchasing a vehicle from the search results list', async () => {
    searchVehicles.mockResolvedValueOnce([mockVehicles[0]]);
    purchaseVehicle.mockResolvedValueOnce({ ...mockVehicles[0], quantity: 1 });

    renderVehiclesPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    await user.click(purchaseBtn);

    expect(purchaseVehicle).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(screen.getByText('1 in stock')).toBeInTheDocument();
    });
  });
});
