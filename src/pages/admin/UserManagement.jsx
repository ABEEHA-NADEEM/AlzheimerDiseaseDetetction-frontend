import React, { useState, useEffect } from 'react'
import { Search, Shield, User as UserIcon, Loader, Trash2, CheckCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { authAPI } from '../../services/api'

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  // =========================
  // Fetch Users
  // =========================
  useEffect(() => {
    authAPI.getAllUsers()
      .then(data => {
        if (Array.isArray(data)) setUsers(data)
        else setError('Failed to load users.')
      })
      .catch(() => setError('Network error. Is backend running?'))
      .finally(() => setLoading(false))
  }, [])

  // =========================
  // Filters
  // =========================
  const filteredUsers = users.filter((u) => {
    const matchRole = filter === 'all' || u.role === filter
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  // =========================
  // Status Logic
  // =========================
  const getStatus = (user) => {
    if (user.role === 'doctor') return user.is_approved ? 'active' : 'pending'
    return 'active'
  }

  // =========================
  // Delete User
  // =========================
  const handleDeleteUser = async (id, name) => {
    const confirmDelete = window.confirm(`Delete "${name}"? This cannot be undone.`)
    if (!confirmDelete) return

    setDeletingId(id)
    setError('')
    try {
      await authAPI.deleteUser(id)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
      setError(err.message || 'Delete failed. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // =========================
  // Approve Doctor
  // =========================
  const handleApprove = async (id) => {
    try {
      await authAPI.approveDoctor(id)
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, is_approved: true } : user
        )
      )
    } catch {
      alert('Approval failed.')
    }
  }

  // =========================
  // Stats
  // =========================
  const stats = {
    total:    users.length,
    doctors:  users.filter(u => u.role === 'doctor').length,
    patients: users.filter(u => u.role === 'patient').length,
    pending:  users.filter(u => u.role === 'doctor' && !u.is_approved).length,
  }

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage all registered users in the system.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200 flex items-center justify-between">
          <p className="text-sm font-medium text-rose-800">{error}</p>
          <button
            onClick={() => setError('')}
            className="text-rose-400 hover:text-rose-600 text-lg leading-none ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',      value: stats.total,    color: 'text-slate-700' },
          { label: 'Doctors',          value: stats.doctors,  color: 'text-teal-700'  },
          { label: 'Patients',         value: stats.patients, color: 'text-blue-700'  },
          { label: 'Pending Approval', value: stats.pending,  color: 'text-amber-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden">

        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">

          {/* Role Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'doctor', 'patient', 'admin'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                  filter === f
                    ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-200'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
                <span className="ml-1.5 text-xs opacity-60">
                  {f === 'all' ? users.length : users.filter(u => u.role === f).length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white"
            />
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const displayName = user.full_name || user.name || user.email
                const initials = displayName
                  .split(' ')
                  .filter(Boolean)
                  .map(w => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
                const status = getStatus(user)
                const isDeleting = deletingId === user.id

                return (
                  <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${isDeleting ? 'opacity-50' : ''}`}>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                          user.role === 'admin'
                            ? 'bg-violet-100 text-violet-700'
                            : user.role === 'doctor'
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin'
                            ? <Shield className="h-4 w-4" />
                            : initials || <UserIcon className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{displayName}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium capitalize ${
                        user.role === 'admin'
                          ? 'bg-violet-50 text-violet-700'
                          : user.role === 'doctor'
                          ? 'bg-teal-50 text-teal-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <Badge variant={status === 'active' ? 'success' : 'warning'}>
                        {status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">

                        {/* Approve Doctor */}
                        {user.role === 'doctor' && !user.is_approved && (
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user.id, displayName)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isDeleting
                            ? <Loader className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              })}

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <UserIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No users found matching your filters.</p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}

      </Card>
    </div>
  )
}