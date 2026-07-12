import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CarIcon from '@mui/icons-material/DirectionsCar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

export default function MainLayout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
    { text: 'Vehicles', path: ROUTES.VEHICLES, icon: <SearchIcon /> },
  ];

  if (isAdmin) {
    menuItems.push({ text: 'Admin', path: ROUTES.ADMIN_VEHICLES, icon: <AdminIcon /> });
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', bg: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3, gap: 1 }}>
        <CarIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
          AutoVault
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mx: 1.5,
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  background: 'rgba(59, 130, 246, 0.15)',
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.25)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    fontWeight={location.pathname === item.path ? 600 : 500}
                    color={location.pathname === item.path ? 'primary.main' : 'inherit'}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navbar */}
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 72 }}>
            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo Desktop */}
            <Box
              component={RouterLink}
              to={ROUTES.DASHBOARD}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
            >
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CarIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  display: 'flex',
                }}
                className="gradient-text"
              >
                AutoVault
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 6, gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    position: 'relative',
                    '&::after': location.pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '16px',
                      right: '16px',
                      height: '3px',
                      borderRadius: '3px 3px 0 0',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    } : null,
                    '&:hover': {
                      color: 'text.primary',
                      background: 'rgba(255,255,255,0.03)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* User Profile / Logout */}
            {user && (
              <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                {!isMobile && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {user.role}
                    </Typography>
                  </Box>
                )}

                <IconButton
                  onClick={handleProfileMenuOpen}
                  data-testid="profile-menu-button"
                  sx={{ p: 0.5, border: '1px solid rgba(248,250,252,0.1)' }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.dark' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.5,
                        width: 220,
                        border: '1px solid rgba(248, 250, 252, 0.06)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ py: 1.5, px: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main', gap: 1.5 }}>
                    <LogoutIcon fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, bg: 'background.default' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Body Content */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: 0 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
