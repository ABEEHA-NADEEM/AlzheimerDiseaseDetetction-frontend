import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const MOCK_SCANS = Array.from({ length: 12 }).map((_, i) => ({
  id: `SCN-2023-${1000 + i}`,
  patient: ['Robert Smith', 'Maria Garcia', 'James Wilson', 'Linda Brown'][i % 4],
  date: `2023-10-${25 - i}`,
  diagnosis: ['Alzheimer', 'Normal', 'MCI', 'Normal'][i % 4],
  confidence: [89, 94, 76, 98][i % 4],
  status: i === 1 ? 'pending' : 'completed',
}))

export function ScanHistory() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
          <p className="text-slate-500 mt-1">View and search all past patient MRI analyses.</p>
        </div>
        <Button onClick={() => navigate('/doctor/upload')}>New Scan</Button>
      </div>

      <Card className="overflow-hidden">
        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                {['Scan ID', 'Patient', 'Date', 'Diagnosis', 'Status', 'Action'].map((th) => (
                  <th
                    key={th}
                    className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                      th === 'Action' ? 'text-right' : ''
                    }`}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {MOCK_SCANS.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{scan.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{scan.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{scan.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {scan.status === 'completed' ? (
                      <div className="flex items-center">
                        <span
                          className={`font-medium ${
                            scan.diagnosis === 'Normal'
                              ? 'text-emerald-600'
                              : scan.diagnosis === 'MCI'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {scan.diagnosis}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">({scan.confidence}%)</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={scan.status === 'completed' ? 'success' : 'warning'}>{scan.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/doctor/results/${scan.id}`)}
                      disabled={scan.status !== 'completed'}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500">Showing 1 to 10 of 42 results</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}