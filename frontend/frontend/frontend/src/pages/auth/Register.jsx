import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'

export function Register() {
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [role,      setRole]      = useState('patient')
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate     = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await register({ name, email, password, role })  // ← real API call

      if (role === 'doctor') {
        navigate('/login', {
          state: { message: 'Registration submitted! Pending admin approval.' },
        })
      } else {
        navigate(`/${role}/dashboard`)
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = ['patient', 'doctor']

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Brain className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-teal-600 hover:text-teal-500">
            Sign in
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 flex items-center justify-center text-sm font-medium rounded-lg border transition-colors ${
                      role === r
                        ? 'bg-teal-50 border-teal-600 text-teal-700 ring-1 ring-teal-600'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="capitalize">{r}</span>
                  </button>
                ))}
              </div>
              {role === 'doctor' && (
                <p className="mt-2 text-xs text-amber-600">
                  Doctor accounts require administrator approval before accessing the platform.
                </p>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder="John Doe"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  label="Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-rose-50 p-4 border border-rose-200"
              >
                <p className="text-sm font-medium text-rose-800">{error}</p>
              </motion.div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>

          </form>
        </Card>
      </div>
    </div>
  )
}