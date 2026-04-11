import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Calendar, Eye, Loader, User } from 'lucide-react'
import { Card }           from '../../components/ui/Card'
import { Badge }          from '../../components/ui/Badge'
import { Button }         from '../../components/ui/Button'
import { authAPI }        from '../../services/api'
import { usePDFDownload } from '../../hooks/usePDFDownload'

const BADGE_MAP = {
  Alzheimer: 'danger',
  MCI:       'warning',
  Normal:    'success',
  CN:        'success',
}

export function MyReports() {
  const [reports,       setReports]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [downloadingId, setDownloadingId] = useState(null)
  const navigate = useNavigate()

  const { downloadPDF } = usePDFDownload()

  useEffect(() => {
    authAPI.getPatientReports()
      .then(data => setReports(data.reports ?? []))
      .catch(err  => setError(err.message || 'Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (report) => {
    setDownloadingId(report.scan_id)
    await downloadPDF(report)
    setDownloadingId(null)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
        <p className="text-slate-500 mt-1">
          View and download your diagnostic reports shared by your doctor.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}

      {!error && reports.length === 0 && (
        <Card className="p-16 flex flex-col items-center text-center space-y-3">
          <div className="p-4 bg-slate-100 rounded-full">
            <User className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No reports yet</h3>
          <p className="text-slate-400 max-w-sm">
            Your doctor will share scan results here once your MRI has been analysed.
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {reports.map((report) => {
          const isDownloading = downloadingId === report.scan_id
          return (
            <Card key={report.scan_id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl hidden sm:block shrink-0">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">MRI Analysis Report</h3>
                      <Badge variant={BADGE_MAP[report.prediction?.predicted_class] || 'default'}>
                        {report.prediction?.predicted_class || '—'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center text-sm text-slate-500 gap-x-4 gap-y-1 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {report.created_at}
                      </span>
                      {report.doctor_name && (
                        <span>
                          Ordered by{' '}
                          <span className="font-medium text-slate-700">{report.doctor_name}</span>
                        </span>
                      )}
                    </div>

                    {/* Probability bars */}
                    <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">Confidence</span>
                        <span className="font-medium text-slate-900">
                          {report.prediction?.confidence ?? '—'}%
                        </span>
                      </div>
                      {report.prediction?.all_probabilities && (
                        <div className="space-y-1 pt-1">
                          {Object.entries(report.prediction.all_probabilities).map(([cls, prob]) => (
                            <div key={cls} className="flex items-center gap-2 text-xs">
                              <span className="w-20 text-slate-500 shrink-0">{cls}</span>
                              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    cls === report.prediction.predicted_class
                                      ? 'bg-teal-500'
                                      : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${prob}%` }}
                                />
                              </div>
                              <span className="w-10 text-right text-slate-600 font-medium">
                                {prob}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex md:flex-col gap-2 shrink-0">
                  <Button
                    variant="primary"
                    className="gap-2 w-full justify-center"
                    onClick={() =>
                      navigate(`/patient/results/${report.scan_id}`, {
                        state: { result: report },
                      })
                    }
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 w-full justify-center"
                    disabled={isDownloading}
                    onClick={() => handleDownload(report)}
                  >
                    {isDownloading
                      ? <Loader className="h-4 w-4 animate-spin" />
                      : <Download className="h-4 w-4" />
                    }
                    {isDownloading ? 'Generating…' : 'Download PDF'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}