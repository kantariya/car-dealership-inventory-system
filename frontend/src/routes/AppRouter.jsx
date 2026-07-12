import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import VehiclesPage from '../pages/VehiclesPage';
import VehicleDetailPage from '../pages/VehicleDetailPage';
import AdminVehiclesPage from '../pages/admin/AdminVehiclesPage';
import { ROUTES } from '../utils/constants';

export default function AppRouter() {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* All routes inside are wrapped in MainLayout */}
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.VEHICLES} element={<VehiclesPage />} />
          <Route path={ROUTES.VEHICLE_DETAIL} element={<VehicleDetailPage />} />
          
          {/* Admin Protected Routes */}
          {isAdmin ? (
            <Route path={ROUTES.ADMIN_VEHICLES} element={<AdminVehiclesPage />} />
          ) : (
            // Redirect unauthorized admin access to dashboard
            <Route path={ROUTES.ADMIN_VEHICLES} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          )}

          {/* Root Redirect */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
