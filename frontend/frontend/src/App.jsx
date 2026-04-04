import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'

// Auth Pages
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { DoctorApprovals } from './pages/admin/DoctorApproval'
import { UserManagement } from './pages/admin/UserManagement'

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard'
import { DoctorProfile } from './pages/doctor/DoctorProfile'
import { ScanUpload } from './pages/doctor/ScanUpload'
import { PredictionResults } from './pages/doctor/PredictionResults'
import { ScanHistory } from './pages/doctor/ScanHistory'

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard'
import { MyReports } from './pages/patient/MyReports'
import { PatientProfile } from './pages/patient/PatientProfile'
import { PatientScanHistory } from './pages/patient/PatientScanHistory'

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout'

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
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout allowedRoles={['admin']} />
          </PrivateRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<DoctorApprovals />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Doctor routes */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout allowedRoles={['doctor']} />
          </PrivateRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/upload" element={<ScanUpload />} />
        <Route path="/doctor/results/:scanId" element={<PredictionResults />} />
        <Route path="/doctor/history" element={<ScanHistory />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        {/* Redirect old or unused paths to history */}
        <Route path="/doctor/patients" element={<Navigate to="/doctor/history" replace />} />
        <Route path="/doctor/reports" element={<Navigate to="/doctor/history" replace />} />
        {/* Default redirect if /doctor */}
        <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
      </Route>

      {/* Patient routes */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout allowedRoles={['patient']} />
          </PrivateRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/reports" element={<MyReports />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/history" element={<PatientScanHistory />} />
        <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
      </Route>

      {/* Redirect unknown routes to login */}
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