import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestockIcon from '@mui/icons-material/LocalActivity';
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from '../../services/vehicleService';
import { VEHICLE_CATEGORIES } from '../../utils/constants';
import { formatPrice, formatCategory } from '../../utils/formatters';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestockDialog, setOpenRestockDialog] = useState(false);

  // Selected Vehicle / Form fields
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(''); // Only for Add
  const [restockAmount, setRestockAmount] = useState('');

  // UI Notification State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllVehicles();
      setVehicles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAddForm = () => {
    setSelectedVehicle(null);
    setMake('');
    setModel('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setOpenFormDialog(true);
  };

  const handleOpenEditForm = (vehicle) => {
    setSelectedVehicle(vehicle);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setCategory(vehicle.category);
    setPrice(vehicle.price.toString());
    setQuantity(vehicle.quantity.toString());
    setOpenFormDialog(true);
  };

  const handleOpenDelete = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDeleteDialog(true);
  };

  const handleOpenRestock = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRestockAmount('');
    setOpenRestockDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenFormDialog(false);
    setOpenDeleteDialog(false);
    setOpenRestockDialog(false);
    setSelectedVehicle(null);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    if (!make || !model || !category || !price) {
      setSnackbar({ open: true, message: 'Please fill in all required fields.', severity: 'error' });
      return;
    }

    setActionLoading(true);
    try {
      if (selectedVehicle) {
        // Edit flow
        const updated = await updateVehicle(selectedVehicle.id, {
          make,
          model,
          category,
          price: parseFloat(price),
          quantity: selectedVehicle.quantity, // Keep quantity unchanged in standard update
        });
        setVehicles((prev) => prev.map((v) => (v.id === selectedVehicle.id ? updated : v)));
        setSnackbar({ open: true, message: 'Vehicle updated successfully!', severity: 'success' });
      } else {
        // Add flow
        const created = await createVehicle({
          make,
          model,
          category,
          price: parseFloat(price),
          quantity: parseInt(quantity || '0', 10),
        });
        setVehicles((prev) => [...prev, created]);
        setSnackbar({ open: true, message: 'Vehicle added successfully!', severity: 'success' });
      }
      handleCloseDialogs();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save vehicle.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    setActionLoading(true);
    try {
      await deleteVehicle(selectedVehicle.id);
      setVehicles((prev) => prev.filter((v) => v.id !== selectedVehicle.id));
      setSnackbar({ open: true, message: 'Vehicle deleted successfully!', severity: 'success' });
      handleCloseDialogs();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete vehicle.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !restockAmount || parseInt(restockAmount, 10) <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid quantity greater than zero.', severity: 'error' });
      return;
    }

    setActionLoading(true);
    try {
      const updated = await restockVehicle(selectedVehicle.id, parseInt(restockAmount, 10));
      setVehicles((prev) => prev.map((v) => (v.id === selectedVehicle.id ? updated : v)));
      setSnackbar({ open: true, message: 'Inventory restocked successfully!', severity: 'success' });
      handleCloseDialogs();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to restock vehicle.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={50} color="primary" />
        <Typography color="text.secondary">Loading showroom database...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }} className="gradient-text">
            Admin Inventory Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage showroom vehicles, update details, delete models, and restock inventory.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddForm}
          sx={{
            py: 1.5,
            px: 3,
            fontWeight: 700,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          }}
        >
          Add Vehicle
        </Button>
      </Box>

      {/* Global Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Vehicles Table */}
      {!error && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            background: 'rgba(19, 22, 41, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(248, 250, 252, 0.06)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.3)',
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(248, 250, 252, 0.08)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Make</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Model</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }} align="center">Stock Quantity</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
                  sx={{
                    '&:hover': { background: 'rgba(255, 255, 255, 0.02)' },
                    '&:last-child cell': { border: 0 },
                    borderBottom: '1px solid rgba(248, 250, 252, 0.04)',
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: 'primary.light',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {formatCategory(vehicle.category)}
                    </Box>
                  </TableCell>
                  <TableCell color="primary.light" sx={{ fontWeight: 700 }}>
                    {formatPrice(vehicle.price)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: vehicle.quantity === 0 ? 'error.main' : 'success.main' }}>
                    {vehicle.quantity}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {/* Restock Button */}
                      <Tooltip title="Restock Inventory">
                        <IconButton
                          color="info"
                          aria-label="Restock"
                          onClick={() => handleOpenRestock(vehicle)}
                          sx={{ '&:hover': { background: 'rgba(2, 136, 209, 0.1)' } }}
                        >
                          <RestockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Edit Button */}
                      <Tooltip title="Edit Details">
                        <IconButton
                          color="warning"
                          aria-label="Edit"
                          onClick={() => handleOpenEditForm(vehicle)}
                          sx={{ '&:hover': { background: 'rgba(237, 108, 2, 0.1)' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Delete Button */}
                      <Tooltip title="Delete Vehicle">
                        <IconButton
                          color="error"
                          aria-label="Delete"
                          onClick={() => handleOpenDelete(vehicle)}
                          sx={{ '&:hover': { background: 'rgba(211, 47, 47, 0.1)' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No vehicles found in the inventory showroom.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Form Dialog */}
      <Dialog open={openFormDialog} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSaveVehicle}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {selectedVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
            <TextField
              required
              fullWidth
              id="make"
              label="Make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Tesla, Ford"
            />
            <TextField
              required
              fullWidth
              id="model"
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Model S, Mustang"
            />

            <FormControl fullWidth variant="outlined" required>
              <InputLabel id="dialog-category-label">Category</InputLabel>
              <Select
                labelId="dialog-category-label"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {VEHICLE_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {formatCategory(cat)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              id="price"
              label="Price ($)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 45000"
            />

            {!selectedVehicle && (
              <TextField
                fullWidth
                id="quantity"
                label="Initial Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 5"
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialogs} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ px: 3 }}>
              {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the {selectedVehicle?.make} {selectedVehicle?.model} from the inventory? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialogs} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={actionLoading} sx={{ px: 3 }}>
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={openRestockDialog} onClose={handleCloseDialogs} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleRestockSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Restock {selectedVehicle?.model}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Enter the amount of units to add to the current inventory (Current: {selectedVehicle?.quantity}).
            </DialogContentText>
            <TextField
              required
              fullWidth
              autoFocus
              id="restockAmount"
              label="Quantity to Add"
              type="number"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              placeholder="e.g. 10"
              slotProps={{
                htmlInput: { min: 1 },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialogs} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={actionLoading} sx={{ px: 3 }}>
              {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar Status Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
