import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Container,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { motion } from 'framer-motion';
import { searchVehicles, purchaseVehicle } from '../services/vehicleService';
import VehicleCard from '../components/vehicle/VehicleCard';
import { VEHICLE_CATEGORIES } from '../utils/constants';
import { formatCategory } from '../utils/formatters';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [purchaseLoadingMap, setPurchaseLoadingMap] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Map single search input query to both make and model parameters for simplicity
      const params = {
        query: searchQuery,
        category,
        minPrice,
        maxPrice,
      };

const data = await searchVehicles(params);
      setVehicles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to search vehicles');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, minPrice, maxPrice]);

  useEffect(() => {
    // Initial fetch on mount
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = async () => {
    setSearchQuery('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchVehicles({
        query: '',
        category: '',
        minPrice: '',
        maxPrice: '',
      });
      setVehicles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to reset vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    setPurchaseLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      const updatedVehicle = await purchaseVehicle(id);
      
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }} className="gradient-text">
          Browse Fleet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Filter through our elite fleet of vehicles to find your perfect match.
        </Typography>
      </Box>

      {/* Modern Filter Panel using CSS Grid */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          mb: 6,
          p: 4,
          borderRadius: 4,
          background: 'rgba(19, 22, 41, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(248, 250, 252, 0.06)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(12, 1fr)',
          },
          gap: 3,
          alignItems: 'center',
        }}
      >
        {/* Search Input */}
        <TextField
          fullWidth
          id="searchQuery"
          label="Search Make or Model"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. Tesla, Ford"
          sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 4' } }}
        />

        {/* Category Select */}
        <FormControl
          fullWidth
          variant="outlined"
          sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2' } }}
        >
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {VEHICLE_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {formatCategory(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Min Price */}
        <TextField
          fullWidth
          id="minPrice"
          label="Min Price"
          type="number"
          variant="outlined"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min"
          sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2' } }}
        />

        {/* Max Price */}
        <TextField
          fullWidth
          id="maxPrice"
          label="Max Price"
          type="number"
          variant="outlined"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max"
          sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2' } }}
        />

        {/* Action Buttons */}
        <Box
          sx={{
            gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 2' },
            display: 'flex',
            gap: 2,
            height: '100%',
            minHeight: 56,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleReset}
            sx={{ py: 1.5, borderColor: 'rgba(248, 250, 252, 0.12)', color: 'text.primary' }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {/* Global Fetch Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results View */}
      {loading ? (
        <Box
          data-testid="loading-indicator"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress size={40} color="primary" />
          <Typography color="text.secondary">Filtering fleet...</Typography>
        </Box>
      ) : (
        <>
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
                  transition={{ duration: 0.3 }}
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
                No vehicles matched your search filters. Try adjusting your parameters.
              </Typography>
            </Box>
          )}
        </>
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
