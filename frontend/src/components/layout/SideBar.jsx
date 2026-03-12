import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard,
  Users,
  FileText,
  Upload,
  Settings,
  Activity,
  LogOut,
  Brain,
} from 'lucide-react'

export function Sidebar() {
  const { user, logout } = useAuth()

  const getNavItems = () => {
    switch (user?.role) {
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
          { name: 'Upload Scan', path: '/doctor/upload', icon: Upload },
          { name: 'Scan History', path: '/doctor/history', icon: Activity },
          { name: 'Profile', path: '/doctor/profile', icon: Settings },
        ]
      case 'patient':
        return [
          { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
          { name: 'My Reports', path: '/patient/reports', icon: FileText },
          { name: 'Scan History', path: '/patient/history', icon: Activity },
          { name: 'Profile', path: '/patient/profile', icon: Settings },
        ]
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Doctor Approvals', path: '/admin/approvals', icon: FileText },
          { name: 'User Management', path: '/admin/users', icon: Users },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-navy-800">
        <Brain className="h-8 w-8 text-teal-400 mr-3" />
        <span className="text-lg font-semibold tracking-tight">NeuroScan AI</span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-600/10 text-teal-400'
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-navy-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  )
}