import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import {Login} from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { DashboardLayout } from './components/layout/DashboardLayout'
// import other pages like Register, Dashboard etc later

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>}/>

      {/* Example protected dashboard routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <PrivateRoute>
            <h1>Doctor Dashboard</h1>
          </PrivateRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <PrivateRoute>
            <h1>Patient Dashboard</h1>
          </PrivateRoute>
        }
      />
      {/* Admin route wrapped in DashboardLayout */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout allowedRoles={['admin']} />
          </PrivateRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Default redirect to dashboard if /admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}