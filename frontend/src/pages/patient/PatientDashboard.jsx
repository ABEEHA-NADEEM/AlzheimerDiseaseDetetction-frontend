import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Activity } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'

const myReports = [
  {
    id: '1',
    date: '2023-10-24',
    doctor: 'Dr. Sarah Chen',
    diagnosis: 'MCI',
    status: 'available',
  },
  {
    id: '2',
    date: '2022-11-15',
    doctor: 'Dr. Sarah Chen',
    diagnosis: 'Normal',
    status: 'available',
  },
]

export function PatientDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {user?.name}
          </h1>
          <p className="text-slate-500 mt-1">
            View your recent medical reports and scan history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          delay={0.1}
          className="bg-linear-to-br from-teal-600 to-teal-800 text-white border-none"
        >
          <div className="p-6">
            <h3 className="text-teal-100 font-medium mb-1">Next Appointment</h3>
            <p className="text-2xl font-bold mb-4">Nov 12, 2023</p>

            <div className="flex items-center text-teal-100 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Dr. Sarah Chen - Follow-up
            </div>
          </div>
        </Card>

        <Card delay={0.2}>
          <div className="p-6 flex items-center justify-between h-full">
            <div>
              <h3 className="text-slate-500 font-medium mb-1">Total Scans</h3>
              <p className="text-3xl font-bold text-slate-900">2</p>
            </div>

            <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card delay={0.3}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">My Reports</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {myReports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start mb-4 sm:mb-0">
                <div className="p-3 rounded-lg bg-teal-50 text-teal-600 mr-4">
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    MRI Scan Report - {report.date}
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Ordered by {report.doctor}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="info">
                      Diagnosis: {report.diagnosis}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  View Details
                </Button>

                <Button variant="primary" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}