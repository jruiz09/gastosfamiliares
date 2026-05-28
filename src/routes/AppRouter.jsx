import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';

import DashboardPage from '../pages/DashboardPage';
import GastosPage from '../pages/GastosPage';
import IngresosPage from '../pages/IngresosPage';
import MovimientosPage from '../pages/MovimientosPage';

import AppLayout from '../components/layout/AppLayout';

import ProtectedRoute from './ProtectedRoute';

import useAuthStore from '../store/authStore';

function AppRouter() {

  const token = useAuthStore(
    (state) => state.token
  );

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/" replace />
              : <LoginPage />
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gastos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <GastosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ingresos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <IngresosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/movimientos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MovimientosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default AppRouter;