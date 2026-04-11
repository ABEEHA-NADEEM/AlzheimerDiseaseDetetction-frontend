import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Activity, Loader, Eye } from 'lucide-react'
import { Card }           from '../../components/ui/Card'
import { Button }         from '../../components/ui/Button'
import { Badge }          from '../../components/ui/Badge'
import { useAuth }        from '../../hooks/useAuth'
import { authAPI }        from '../../services/api'
import { usePDFDownload } from '../../hooks/usePDFDownload'

const BADGE_MAP = {
  Alzheimer: 'danger',
  MCI:       'warning',
  Normal:    'success',
  CN:        'success',
}

export function PatientDashboard() {
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [reports,       setReports]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [downloadingId, setDownloadingId] = useState(null)

  const { downloadPDF } = usePDFDownload()

  useEffect(() => {
    authAPI.getPatientReports()
      .then(data => setReports(data.reports ?? []))
      .catch(err  => setError(err.message || 'Could not load reports.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (report) => {
    setDownloadingId(report.scan_id)
    await downloadPDF(report)
    setDownloadingId(null)
  }

  // Show last 3 reports in the dashboard preview
  const recentReports = reports.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* ── Greeting ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {user?.name || 'Patient'}
          </h1>
          <p className="text-slate-500 mt-1">
            View your recent medical reports and scan history.
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-teal-600 to-teal-800 text-white border-none">
          <div className="p-6">
            <h3 className="text-teal-100 font-medium mb-1">Total Reports</h3>
            <p className="text-3xl font-bold mb-4">
              {loading ? '—' : reports.length}
            </p>
            <div className="flex items-center text-teal-100 text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Diagnostic reports from your doctor
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between h-full">
            <div>
              <h3 className="text-slate-500 font-medium mb-1">Latest Diagnosis</h3>
              {loading ? (
                <Loader className="h-5 w-5 animate-spin text-teal-600 mt-1" />
              ) : reports.length > 0 ? (
                <div className="mt-2">
                  <Badge variant={BADGE_MAP[reports[0].prediction?.predicted_class] || 'default'}>
                    {reports[0].prediction?.predicted_class || '—'}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-1">{reports[0].created_at}</p>
                </div>
              ) : (
                <p className="text-slate-400 text-sm mt-1">No reports yet</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Recent Reports ── */}
      <Card>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
          {reports.length > 3 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/patient/reports')}>
              View all
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="h-7 w-7 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="p-6">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        ) : recentReports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No reports yet. Your doctor will share results here after your MRI is analysed.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentReports.map((report, idx) => {
              const isDownloading = downloadingId === report.scan_id
              return (
                <motion.div
                  key={report.scan_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.07 }}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">
                          MRI Analysis Report
                        </h4>
                        <Badge variant={BADGE_MAP[report.prediction?.predicted_class] || 'default'}>
                          {report.prediction?.predicted_class || '—'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {report.created_at}
                        </span>
                        {report.doctor_name && (
                          <span>by <span className="font-medium text-slate-700">{report.doctor_name}</span></span>
                        )}
                        {report.prediction?.confidence != null && (
                          <span className="text-slate-400">
                            Confidence: {report.prediction.confidence}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => navigate(`/patient/results/${report.scan_id}`, { state: { result: report } })}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-1"
                      disabled={isDownloading}
                      onClick={() => handleDownload(report)}
                    >
                      {isDownloading
                        ? <Loader className="h-4 w-4 animate-spin" />
                        : <Download className="h-4 w-4" />
                      }
                      PDF
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}