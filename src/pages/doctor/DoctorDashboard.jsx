import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  FileText,
  Clock,
  Plus,
  ArrowRight,
  Search,
  ChevronUp,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'

// ── Helpers ───────────────────────────────────────────────

function getAuthHeaders() {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function fetchReports() {
  const res = await fetch('/api/diagnoses/doctor/reports/', {
    headers: getAuthHeaders(),
  })
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Server returned ${res.status} ${res.statusText} (not JSON). ` +
      `Check that the API URL is correct and your auth token is valid.`
    )
  }
  const json = await res.json()
  if (!res.ok) throw new Error(json?.detail || json?.error || `HTTP ${res.status}`)
  return json.reports
}

function deriveStats(reports) {
  const completedScans  = reports.length
  const uniquePatients  = new Set(reports.map((r) => r.patient?.name).filter(Boolean)).size
  const pendingReview   = reports.filter(
    (r) => r.prediction?.confidence != null && r.prediction.confidence < 70
  ).length
  return { uniquePatients, completedScans, pendingReview }
}

function toRow(report) {
  return {
    id:         String(report.scan_id),
    patient:    report.patient?.name   || '—',
    date:       report.created_at,
    status:     report.prediction?.confidence >= 70 ? 'completed' : 'pending',
    diagnosis:  report.prediction?.predicted_class ?? null,
    confidence: report.prediction?.confidence      ?? null,
  }
}

// ── Component ─────────────────────────────────────────────

export function DoctorDashboard() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [reports,   setReports]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [refreshed, setRefreshed] = useState(0)
  const [search,    setSearch]    = useState('')
  const [showAll,   setShowAll]   = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchReports()
      .then((data) => { if (!cancelled) setReports(data) })
      .catch((err)  => { if (!cancelled) setError(err.message) })
      .finally(()   => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [refreshed])

  const handleRefresh = () => {
    setShowAll(false)
    setSearch('')
    setRefreshed((n) => n + 1)
  }

  // ── Filter by search term (patient name or diagnosis) ──
  const allRows = useMemo(() =>
    reports.map(toRow).filter((row) => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return (
        row.patient.toLowerCase().includes(q) ||
        (row.diagnosis || '').toLowerCase().includes(q)
      )
    }),
    [reports, search]
  )

  // Show 3 by default; show all when toggled
  const visibleRows = showAll ? allRows : allRows.slice(0, 3)

  const stats = deriveStats(reports)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your patients today.
          </p>
        </div>

        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => navigate('/doctor/upload')}>
            <Plus className="h-4 w-4" />
            New Scan
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card delay={0.1}>
          <div className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Total Patients</p>
              <p className="text-2xl font-semibold text-slate-900">
                {loading ? '—' : stats.uniquePatients}
              </p>
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
              <p className="text-2xl font-semibold text-slate-900">
                {loading ? '—' : stats.completedScans}
              </p>
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
              <p className="text-2xl font-semibold text-slate-900">
                {loading ? '—' : stats.pendingReview}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Recent scans table ── */}
      <Card delay={0.4}>

        {/* Table header + search + view-all toggle */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h2 className="text-lg font-semibold shrink-0">Recent Scans</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search patient or diagnosis…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowAll(true) }}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                           bg-white placeholder-slate-400"
              />
            </div>

            {/* View All / Show Less */}
            {!loading && allRows.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll((v) => !v)}
                className="shrink-0 gap-1"
              >
                {showAll ? (
                  <><ChevronUp className="h-4 w-4" /> Show Less</>
                ) : (
                  <>View All <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Table body */}
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm animate-pulse">
            Loading scans…
          </div>
        ) : allRows.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            {search ? `No results for "${search}".` : 'No scans found.'}
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left">Patient</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Diagnosis</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((scan, idx) => (
                  <motion.tr
                    key={scan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + idx * 0.05 }}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium">{scan.patient}</td>
                    <td className="px-6 py-4 text-slate-500">{scan.date}</td>

                    <td className="px-6 py-4">
                      <Badge variant={scan.status === 'completed' ? 'success' : 'warning'}>
                        {scan.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      {scan.diagnosis ? (
                        <div className="flex items-center">
                          <span className="font-medium">{scan.diagnosis}</span>
                          <span className="ml-2 text-xs text-slate-400">
                            ({scan.confidence}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Row count hint */}
            {!showAll && allRows.length > 3 && (
              <p className="px-6 py-3 text-xs text-slate-400">
                Showing 3 of {allRows.length} scans.{' '}
                <button
                  className="underline text-teal-600 font-medium"
                  onClick={() => setShowAll(true)}
                >
                  View all
                </button>
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  )
}