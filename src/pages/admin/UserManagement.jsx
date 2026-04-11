import React, { useState, useEffect } from 'react'
import { Search, MoreVertical, Shield, User as UserIcon, Loader } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { authAPI } from '../../services/api'

export function UserManagement() {
  const [users,   setUsers]   = useState([])
  const [filter,  setFilter]  = useState('all')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    authAPI.getAllUsers()          // ← fixed
      .then(data => {
        if (Array.isArray(data)) setUsers(data)
        else setError('Failed to load users.')
      })
      .catch(() => setError('Network error. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = users.filter((u) => {
    const matchRole   = filter === 'all' || u.role === filter
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const getStatus = (user) => {
    if (user.role === 'doctor') return user.is_approved ? 'active' : 'pending'
    return 'active'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage all system users.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
          <p className="text-sm font-medium text-rose-800">{error}</p>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">

          {/* Role filter tabs */}
          <div className="flex space-x-2">
            {['all', 'doctor', 'patient', 'admin'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                  filter === f
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        {user.role === 'admin'
                          ? <Shield className="h-5 w-5" />
                          : <UserIcon className="h-5 w-5" />
                        }
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-slate-900">
                    {user.role}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatus(user) === 'active' ? 'success' : 'warning'}>
                      {getStatus(user)}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}