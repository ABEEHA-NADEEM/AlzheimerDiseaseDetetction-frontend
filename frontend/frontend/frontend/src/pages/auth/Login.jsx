import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Lock, Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [role,      setRole]      = useState('doctor')
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Show message from register page (doctor pending approval)
  const message = location?.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await login(email, password, role)  // ← real API call
      navigate(`/${user.role}/dashboard`, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = ['doctor', 'patient', 'admin']

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center"
          >
            <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-xl shadow-teal-500/30 mb-4">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-slate-900"
          >
            Welcome Back
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-slate-600"
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Sign up here
            </Link>
          </motion.p>
        </div>

        {/* Success message from register (doctor approval) */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-amber-50 p-4 border border-amber-200"
          >
            <p className="text-sm font-medium text-amber-800">{message}</p>
          </motion.div>
        )}

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 border-slate-200/80">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((r) => (
                    <motion.button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-2.5 px-3 flex items-center justify-center text-sm font-medium rounded-xl border-2 transition-all ${
                        role === r
                          ? 'bg-teal-50 border-teal-600 text-teal-700 shadow-sm shadow-teal-600/20'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="capitalize">{r}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                      placeholder={`${role}@example.com`}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                      placeholder="••••••••"
                    />
                  </div>
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                  <a     
                  href="#"
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-linear-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all"
                isLoading={isLoading}
              >
                Sign In
              </Button>

            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}