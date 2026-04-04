import React, { useState, createContext, useContext } from 'react'

// Mock user data
const mockUsers = {
  'doctor@demo.com': {
    id: '1',
    email: 'doctor@demo.com',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    approved: true,
    specialization: 'Neurologist',
  },
  'patient@demo.com': {
    id: '2',
    email: 'patient@demo.com',
    name: 'Robert Smith',
    role: 'patient',
  },
  'admin@demo.com': {
    id: '3',
    email: 'admin@demo.com',
    name: 'System Admin',
    role: 'admin',
  },
}

// Create Auth context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, role) => {
    const foundUser = mockUsers[email]
    if (foundUser && foundUser.role === role) {
      setUser(foundUser)
    } else {
      // Fallback for demo
      setUser({
        id: Math.random().toString(),
        email,
        name: email.split('@')[0],
        role,
        approved: role !== 'doctor',
      })
    }
  }

  const logout = () => setUser(null)

  const register = (data) => {
    const newUser = {
      id: Math.random().toString(),
      email: data.email || '',
      name: data.name || '',
      role: data.role || 'patient',
      approved: data.role !== 'doctor',
    }
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}