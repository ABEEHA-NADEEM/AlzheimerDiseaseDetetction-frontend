import React, { useState, createContext, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Restore session on page refresh ──────────────────
  useEffect(() => {
    const token     = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // ── Login ─────────────────────────────────────────────
  const login = async (email, password, role) => {
    const data = await authAPI.login(email, password, role)

    if (data.error) {
      throw new Error(data.error)
    }

    localStorage.setItem('access_token',  data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user',          JSON.stringify(data.user))
    setUser(data.user)

    return data.user
  }

  // ── Register ──────────────────────────────────────────
  const register = async (formData) => {
    const data = await authAPI.register({
      username:   formData.email.split('@')[0],
      email:      formData.email,
      password:   formData.password,
      first_name: formData.name.split(' ')[0],
      last_name:  formData.name.split(' ')[1] || '',
      role:       formData.role,
    })

    if (data.error) {
      throw new Error(data.error)
    }

    // Doctors need approval — don't set session yet
    if (formData.role !== 'doctor') {
      localStorage.setItem('access_token',  data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user',          JSON.stringify(data.user))
      setUser(data.user)
    }

    return data
  }

  // ── Logout ────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}