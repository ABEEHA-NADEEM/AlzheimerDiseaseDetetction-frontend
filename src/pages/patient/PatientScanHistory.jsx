import React from 'react'
import { Activity, Calendar } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

const MOCK_HISTORY = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    type: 'Brain MRI (T1/T2)',
    doctor: 'Dr. Sarah Chen',
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Nov 15, 2022',
    type: 'Brain MRI (T1/T2)',
    doctor: 'Dr. Sarah Chen',
    status: 'Completed',
  },
  {
    id: '3',
    date: 'Oct 10, 2021',
    type: 'Brain MRI (T1/T2)',
    doctor: 'Dr. James Wilson',
    status: 'Completed',
  },
]

export function PatientScanHistory() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
        <p className="text-slate-500 mt-1">Timeline of your MRI scans.</p>
      </div>

      <Card className="p-6">
        <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 py-4">
          {MOCK_HISTORY.map((scan) => (
            <div key={scan.id} className="relative pl-6 md:pl-8">
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-teal-500 ring-4 ring-white" />
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900">{scan.type}</h3>
                  <Badge variant="success">{scan.status}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row text-sm text-slate-500 gap-2 sm:gap-6">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" /> {scan.date}
                  </span>
                  <span className="flex items-center">
                    <Activity className="h-4 w-4 mr-1.5" /> Ordered by {scan.doctor}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
