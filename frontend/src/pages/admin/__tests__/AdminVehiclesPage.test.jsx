import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../../theme';
import AdminVehiclesPage from '../AdminVehiclesPage';

// Mock the vehicle service
vi.mock('../../../services/vehicleService', () => ({
  getAllVehicles: vi.fn(),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
  restockVehicle: vi.fn(),
}));

import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from '../../../services/vehicleService';

const mockVehicles = [
  { id: 1, make: 'Tesla', model: 'Model Y', category: 'SUV', price: 54000, quantity: 3 },
  { id: 2, make: 'Ford', model: 'Mustang', category: 'COUPE', price: 38000, quantity: 1 },
];

function renderAdminPage() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AdminVehiclesPage />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('AdminVehiclesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and render all vehicles in a table or list view', async () => {
    getAllVehicles.mockResolvedValueOnce(mockVehicles);
    renderAdminPage();

    await waitFor(() => {
      expect(getAllVehicles).toHaveBeenCalled();
    });

    expect(screen.getByText('Tesla')).toBeInTheDocument();
    expect(screen.getByText('Model Y')).toBeInTheDocument();
    expect(screen.getByText('$54,000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Ford')).toBeInTheDocument();
    expect(screen.getByText('Mustang')).toBeInTheDocument();
    expect(screen.getByText('$38,000')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should open Add Vehicle modal, submit form, and append to the list', async () => {
    getAllVehicles.mockResolvedValueOnce(mockVehicles);
    renderAdminPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Tesla')).toBeInTheDocument();
    });

    // Open add dialog
    await user.click(screen.getByRole('button', { name: /add vehicle/i }));

    // Verify fields exist
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/initial quantity/i)).toBeInTheDocument();

    // Fill form
    await user.type(screen.getByLabelText(/make/i), 'Chevrolet');
    await user.type(screen.getByLabelText(/model/i), 'Corvette');
    
    // Select category dropdown - wait for select to render and trigger click
    const selectTrigger = screen.getByLabelText(/category/i);
    await user.click(selectTrigger);
    
    // Pick Coupe category item
    const coupeOption = await screen.findByRole('option', { name: /coupe/i });
    await user.click(coupeOption);

    await user.type(screen.getByLabelText(/price/i), '65000');
    await user.type(screen.getByLabelText(/initial quantity/i), '2');

    const newVehicle = { id: 3, make: 'Chevrolet', model: 'Corvette', category: 'COUPE', price: 65000, quantity: 2 };
    createVehicle.mockResolvedValueOnce(newVehicle);

    // Click submit
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(createVehicle).toHaveBeenCalledWith({
      make: 'Chevrolet',
      model: 'Corvette',
      category: 'COUPE',
      price: 65000,
      quantity: 2,
    });

    // Check list updates
    await waitFor(() => {
      expect(screen.getByText('Chevrolet')).toBeInTheDocument();
    });
  });

  it('should open Edit Vehicle modal, update fields, and update the list', async () => {
    getAllVehicles.mockResolvedValueOnce(mockVehicles);
    renderAdminPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Ford')).toBeInTheDocument();
    });

    // Click edit button for Ford (Mustang)
    const editBtns = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editBtns[1]); // second row is Ford

    // Verify fields populated
    const makeInput = screen.getByLabelText(/make/i);
    expect(makeInput).toHaveValue('Ford');
    const priceInput = screen.getByLabelText(/price/i);
    expect(priceInput).toHaveValue(38000);

    // Modify price
    await user.clear(priceInput);
    await user.type(priceInput, '42000');

    const updatedVehicle = { ...mockVehicles[1], price: 42000 };
    updateVehicle.mockResolvedValueOnce(updatedVehicle);

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(updateVehicle).toHaveBeenCalledWith(2, {
      make: 'Ford',
      model: 'Mustang',
      category: 'COUPE',
      price: 42000,
      quantity: 1,
    });

    await waitFor(() => {
      expect(screen.getByText('$42,000')).toBeInTheDocument();
    });
  });

  it('should display confirmation dialog and delete a vehicle on confirm', async () => {
    getAllVehicles.mockResolvedValueOnce(mockVehicles);
    renderAdminPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Tesla')).toBeInTheDocument();
    });

    // Click delete for Tesla (first row)
    const deleteBtns = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteBtns[0]);

    // Confirm deletion dialog
    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
    
    deleteVehicle.mockResolvedValueOnce();
    
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(deleteVehicle).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(screen.queryByText('Model Y')).not.toBeInTheDocument();
    });
  });

  it('should open Restock Dialog, call API, and increase vehicle stock', async () => {
    getAllVehicles.mockResolvedValueOnce(mockVehicles);
    renderAdminPage();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Ford')).toBeInTheDocument();
    });

    // Click restock for Ford (second row)
    const restockBtns = screen.getAllByRole('button', { name: /restock/i });
    await user.click(restockBtns[1]);

    expect(screen.getByText(/restock mustang/i)).toBeInTheDocument();
    const restockInput = screen.getByLabelText(/quantity to add/i);
    expect(restockInput).toBeInTheDocument();

    await user.type(restockInput, '5');

    const restockedFord = { ...mockVehicles[1], quantity: 6 };
    restockVehicle.mockResolvedValueOnce(restockedFord);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(restockVehicle).toHaveBeenCalledWith(2, 5);
    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument(); // new stock count is 6
    });
  });
});
