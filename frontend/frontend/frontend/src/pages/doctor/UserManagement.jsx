import React, { useState } from 'react'
import { Search, MoreVertical, Shield, User as UserIcon } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    email: 'doctor@demo.com',
    role: 'doctor',
    status: 'active',
    joined: '2023-01-15',
  },
  {
    id: '2',
    name: 'Robert Smith',
    email: 'patient@demo.com',
    role: 'patient',
    status: 'active',
    joined: '2023-05-20',
  },
  {
    id: '3',
    name: 'System Admin',
    email: 'admin@demo.com',
    role: 'admin',
    status: 'active',
    joined: '2022-11-01',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'j.wilson@hospital.com',
    role: 'doctor',
    status: 'pending',
    joined: '2023-10-25',
  },
]

export function UserManagement() {
  const [filter, setFilter] = useState('all')

  const filteredUsers = MOCK_USERS.filter(
    (u) => filter === 'all' || u.role === filter
  )

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>
        <p className="text-slate-500 mt-1">
          View and manage all system users.
        </p>
      </div>

      <Card className="overflow-hidden">

        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">

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

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>

            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-slate-200">

            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">

              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">

                  <td className="px-6 py-4 whitespace-nowrap">

                    <div className="flex items-center">

                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        {user.role === 'admin' ? (
                          <Shield className="h-5 w-5" />
                        ) : (
                          <UserIcon className="h-5 w-5" />
                        )}
                      </div>

                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {user.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {user.email}
                        </div>
                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-slate-900">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        user.status === 'active'
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.joined}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </Card>

    </div>
  )
}