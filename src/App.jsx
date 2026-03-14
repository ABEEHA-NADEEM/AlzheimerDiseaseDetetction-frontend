import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import {Login} from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DoctorDashboard } from './pages/doctor/DoctorDashboard'
import { PatientDashboard } from './pages/patient/PatientDashboard'
import { DoctorApprovals } from './pages/admin/DoctorApproval'
import { UserManagement } from './pages/admin/UserManagement'
import { MyReports } from './pages/patient/MyReports'
import { PatientProfile } from './pages/patient/PatientProfile'
import { PatientScanHistory } from './pages/patient/PatientScanHistory'
import { DoctorProfile } from './pages/doctor/DoctorProfile'
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
        <Route path='/admin/approvals' element={<DoctorApprovals/>}/>
        <Route path='/admin/users' element={<UserManagement/>}/>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Doctor route wrapped in DashboardLayout */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout allowedRoles={['doctor']} />
          </PrivateRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile/>}/>
        {/* Default redirect to dashboard if /admin */}
        <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
      </Route>

      {/* Patient route wrapped in DashboardLayout */}
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
        {/* Default redirect to dashboard if /admin */}
        <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
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