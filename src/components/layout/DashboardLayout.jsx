import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Sidebar } from './Sidebar'

export function DashboardLayout({ allowedRoles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}