import React, { useState, useEffect } from 'react'
import { Users, CheckCircle, XCircle, Activity, Shield, Loader } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { motion } from 'framer-motion'
import { authAPI } from '../../services/api'

export function AdminDashboard() {
  const [stats,    setStats]    = useState({
    totalUsers:       0,
    activeDoctors:    0,
    pendingApprovals: 0,
    totalScans:       0,
  })
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [loading,        setLoading]        = useState(true)
  const [actionId,       setActionId]       = useState(null)
  const [error,          setError]          = useState('')

  // ── Fetch data on load ────────────────────────────────
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all users + pending doctors in parallel
      const [allUsers, pending] = await Promise.all([
        authAPI.allUsers(),
        authAPI.pendingDoctors(),
      ])

      // Calculate stats from real data
      if (Array.isArray(allUsers)) {
        setStats({
          totalUsers:       allUsers.length,
          activeDoctors:    allUsers.filter(u => u.role === 'doctor' && u.is_approved).length,
          pendingApprovals: allUsers.filter(u => u.role === 'doctor' && !u.is_approved).length,
          totalScans:       0, // will connect to diagnosis API later
        })
      }

      if (Array.isArray(pending)) {
        setPendingDoctors(pending)
      }

    } catch (err) {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  // ── Approve doctor ────────────────────────────────────
  const handleApprove = async (userId) => {
    setActionId(userId)
    try {
      await authAPI.approveDoctor(userId)
      setPendingDoctors(prev => prev.filter(d => d.id !== userId))
      setStats(prev => ({
        ...prev,
        activeDoctors:    prev.activeDoctors + 1,
        pendingApprovals: prev.pendingApprovals - 1,
      }))
    } catch (err) {
      setError('Failed to approve doctor.')
    } finally {
      setActionId(null)
    }
  }

  // ── Reject doctor ─────────────────────────────────────
  const handleReject = async (userId) => {
    setActionId(userId)
    try {
      await authAPI.rejectDoctor(userId)
      setPendingDoctors(prev => prev.filter(d => d.id !== userId))
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }))
    } catch (err) {
      setError('Failed to reject doctor.')
    } finally {
      setActionId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-500 mt-1">Manage users, approvals, and system health.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
          <p className="text-sm font-medium text-rose-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.totalUsers}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-slate-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Doctors</p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.activeDoctors}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Scans</p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.totalScans}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
              <p className="text-2xl font-semibold text-amber-600">
                {stats.pendingApprovals}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Doctor Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Pending Doctor Approvals
            </h2>
          </div>

          <div className="p-0">
            {pendingDoctors.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pendingDoctors.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-6 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {doc.name}
                      </h4>
                      <p className="text-sm text-slate-500">{doc.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="default">
                          {doc.specialization || 'Not specified'}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Applied: {doc.created_at
                            ? new Date(doc.created_at).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(doc.id)}
                        isLoading={actionId === doc.id}
                        className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleApprove(doc.id)}
                        isLoading={actionId === doc.id}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                ✅ No pending approvals.
              </div>
            )}
          </div>
        </Card>
      </div>

    </div>
  )
}