import React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'

const recentScans = [
  {
    id: '1',
    patient: 'Robert Smith',
    date: '2023-10-24',
    status: 'completed',
    diagnosis: 'MCI',
    confidence: 87,
  },
  {
    id: '2',
    patient: 'Maria Garcia',
    date: '2023-10-23',
    status: 'pending',
    diagnosis: null,
    confidence: null,
  },
  {
    id: '3',
    patient: 'James Wilson',
    date: '2023-10-21',
    status: 'completed',
    diagnosis: 'Normal',
    confidence: 94,
  },
]

export function DoctorDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your patients today.
          </p>
        </div>

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card delay={0.1}>
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Total Patients</p>
              <p className="text-2xl font-semibold text-slate-900">124</p>
            </div>
          </div>
        </Card>

        <Card delay={0.2}>
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Completed Scans</p>
              <p className="text-2xl font-semibold text-slate-900">312</p>
            </div>
          </div>
        </Card>

        <Card delay={0.3}>
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Pending Review</p>
              <p className="text-2xl font-semibold text-slate-900">5</p>
            </div>
          </div>
        </Card>
      </div>

      <Card delay={0.4}>
        <div className="p-6 border-b border-slate-200 flex justify-between">
          <h2 className="text-lg font-semibold">Recent Scans</h2>
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Diagnosis</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {recentScans.map((scan, idx) => (
              <motion.tr
                key={scan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="border-b hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">{scan.patient}</td>
                <td className="px-6 py-4 text-slate-500">{scan.date}</td>

                <td className="px-6 py-4">
                  <Badge
                    variant={
                      scan.status === 'completed'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {scan.status}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  {scan.diagnosis ? (
                    <div className="flex items-center">
                      <span className="font-medium">
                        {scan.diagnosis}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        ({scan.confidence}%)
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function Upload(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}