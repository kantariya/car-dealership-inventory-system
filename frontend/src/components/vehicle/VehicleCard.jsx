import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import CartIcon from '@mui/icons-material/ShoppingCart';
import StockIcon from '@mui/icons-material/LocalActivity';
import { formatPrice, formatCategory, getVehicleImage } from '../../utils/formatters';

export default function VehicleCard({ vehicle, onPurchase, purchaseLoading }) {
  const { id, make, model, category, price, quantity } = vehicle;
  const [localLoading, setLocalLoading] = useState(false);

  const isOutOfStock = quantity === 0;

  const handlePurchase = async () => {
    if (onPurchase) {
      setLocalLoading(true);
      try {
        await onPurchase(id);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const loading = purchaseLoading || localLoading;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 30px rgba(59, 130, 246, 0.25)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        },
      }}
    >
      {/* Category Badge on top of image */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <Chip
          label={formatCategory(category)}
          color="primary"
          size="small"
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        />
      </Box>

      {/* Vehicle Image */}
      <CardMedia
        component="img"
        height="200"
        image={getVehicleImage(category)}
        alt={`${make} ${model}`}
        sx={{
          objectFit: 'cover',
          borderBottom: '1px solid rgba(248, 250, 252, 0.06)',
        }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 3 }}>
        {/* Title */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.01em' }}>
          {make} {model}
        </Typography>

        {/* Price */}
        <Typography variant="h4" color="primary.light" sx={{ fontWeight: 800, mb: 2 }}>
          {formatPrice(price)}
        </Typography>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <StockIcon sx={{ fontSize: 18, color: isOutOfStock ? 'error.main' : 'success.main' }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: isOutOfStock ? 'error.main' : 'success.main',
            }}
          >
            {isOutOfStock ? 'Out of stock' : `${quantity} in stock`}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isOutOfStock || loading}
          onClick={handlePurchase}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CartIcon />}
          sx={{
            py: 1.2,
            background: isOutOfStock
              ? 'rgba(255, 255, 255, 0.05)'
              : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: isOutOfStock ? 'rgba(255, 255, 255, 0.3)' : '#fff',
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          {isOutOfStock ? 'Sold Out' : 'Purchase'}
        </Button>
      </CardActions>
    </Card>
  );
}
