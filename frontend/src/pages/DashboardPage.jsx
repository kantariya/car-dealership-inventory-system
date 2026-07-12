import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import { getAllVehicles, purchaseVehicle } from '../services/vehicleService';
import VehicleCard from '../components/vehicle/VehicleCard';

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [purchaseLoadingMap, setPurchaseLoadingMap] = useState({});

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handlePurchase = async (id) => {
    setPurchaseLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      const updatedVehicle = await purchaseVehicle(id);
      
      // Update local state with the returned updated vehicle details (decremented quantity)
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedVehicle : v))
      );

      setSnackbar({
        open: true,
        message: `Successfully purchased the ${updatedVehicle.make} ${updatedVehicle.model}!`,
        severity: 'success',
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to purchase vehicle. Please try again.';
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error',
      });
    } finally {
      setPurchaseLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        data-testid="loading-indicator"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={50} color="primary" />
        <Typography color="text.secondary" variant="h6">
          Initializing Showroom...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 6,
          p: { xs: 4, md: 8 },
          background: 'linear-gradient(135deg, rgba(19, 22, 41, 0.95) 0%, rgba(11, 13, 23, 0.95) 100%)',
          border: '1px solid rgba(248, 250, 252, 0.06)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            className="gradient-text"
            sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}
          >
            AutoVault Showroom
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mb: 0, fontWeight: 400 }}>
            Discover and purchase premium quality vehicles. Engineered for excellence, curated for you.
          </Typography>
        </motion.div>
      </Box>

      {/* Global Fetch Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Vehicles Grid (using modern CSS Grid inside a Box) */}
      {!error && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 4,
          }}
        >
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%' }}
            >
              <VehicleCard
                vehicle={vehicle}
                onPurchase={handlePurchase}
                purchaseLoading={purchaseLoadingMap[vehicle.id]}
              />
            </motion.div>
          ))}
        </Box>
      )}

      {!error && vehicles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No vehicles available in the showroom right now.
          </Typography>
        </Box>
      )}

      {/* Status Notifications */}
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
    </Container>
  );
}
