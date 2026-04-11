import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const PAGE_SIZE = 10

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
]

export function ScanHistory() {
  const navigate = useNavigate()

  const [allScans, setAllScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Fetch on mount
  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('access_token')
        const res = await fetch('/api/diagnoses/doctor/reports/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setAllScans(data.reports ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchScans()
  }, [])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  // Filtering
  const filtered = allScans.filter((scan) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !q ||
      scan.patient?.name?.toLowerCase().includes(q) ||
      String(scan.scan_id)?.toLowerCase().includes(q) ||
      scan.prediction?.predicted_class?.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === 'all' || scan.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length)
  const pageScans = filtered.slice(pageStart, pageEnd)

  const diagnosisColor = (diagnosis) => {
    if (!diagnosis) return 'text-slate-400'
    const d = diagnosis.toLowerCase()
    if (d === 'normal') return 'text-emerald-600'
    if (d === 'mci') return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
          <p className="text-slate-500 mt-1">View and search all past patient MRI analyses.</p>
        </div>
        <Button onClick={() => navigate('/doctor/upload')}>New Scan</Button>
      </div>

      <Card className="overflow-hidden">
        {/* Search + Status Tabs */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient name, scan ID, or diagnosis…"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex rounded-lg border border-slate-300 overflow-hidden shrink-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === tab.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                } ${tab.value !== 'all' ? 'border-l border-slate-300' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading scans…</span>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-sm text-rose-500">
              Failed to load scans: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">
              No scans match your search.
            </div>
          ) : (
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
                {pageScans.map((scan) => {
                  const isCompleted = !!scan.prediction?.predicted_class
                  return (
                  <tr key={scan.scan_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {scan.scan_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {scan.patient?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {scan.created_at ?? '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {scan.status === 'completed' || scan.prediction?.predicted_class ? (
                        <div className="flex items-center">
                          <span className={`font-medium ${diagnosisColor(scan.prediction?.predicted_class)}`}>
                            {scan.prediction?.predicted_class ?? '—'}
                          </span>
                          {scan.prediction?.confidence != null && (
                            <span className="ml-2 text-xs text-slate-400">
                              ({scan.prediction.confidence}%)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={isCompleted ? 'success' : 'warning'}>
                        {isCompleted ? 'completed' : 'pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/doctor/results/${scan.scan_id}`)}
                        disabled={!isCompleted}
                        className="text-teal-600 hover:text-teal-900 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-sm text-slate-500">
              Showing {pageStart + 1}–{pageEnd} of {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600 px-1">
                {safePage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}