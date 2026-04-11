import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Calendar, Eye, Loader, User } from 'lucide-react'
import { Card }    from '../../components/ui/Card'
import { Badge }   from '../../components/ui/Badge'
import { Button }  from '../../components/ui/Button'
import { authAPI } from '../../services/api'

const BADGE_MAP = {
  Alzheimer: 'danger',
  MCI:       'warning',
  Normal:    'success',
  CN:        'success',
}

export function PatientScanHistory() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    authAPI.getPatientReports()
      .then(data => setReports(data.reports ?? []))
      .catch(err  => setError(err.message || 'Could not load scan history.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
        <p className="text-slate-500 mt-1">Timeline of your MRI scans.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="h-7 w-7 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <Card className="p-16 flex flex-col items-center text-center space-y-3">
          <div className="p-4 bg-slate-100 rounded-full">
            <User className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No scans yet</h3>
          <p className="text-slate-400 max-w-sm">
            Your scan history will appear here once your doctor runs an MRI analysis.
          </p>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 py-4">
            {reports.map((report) => (
              <div key={report.scan_id} className="relative pl-6 md:pl-8">
                {/* Timeline dot — coloured by diagnosis */}
                <div
                  className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full ring-4 ring-white ${
                    report.prediction?.predicted_class === 'Normal' || report.prediction?.predicted_class === 'CN'
                      ? 'bg-emerald-500'
                      : report.prediction?.predicted_class === 'MCI'
                      ? 'bg-amber-500'
                      : report.prediction?.predicted_class
                      ? 'bg-rose-500'
                      : 'bg-teal-500'
                  }`}
                />

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">Brain MRI Analysis</h3>
                      {report.prediction?.predicted_class && (
                        <Badge variant={BADGE_MAP[report.prediction.predicted_class] || 'default'}>
                          {report.prediction.predicted_class}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 shrink-0"
                      onClick={() =>
                        navigate(`/patient/results/${report.scan_id}`, {
                          state: { result: report },
                        })
                      }
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row text-sm text-slate-500 gap-2 sm:gap-6">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5" /> {report.created_at}
                    </span>
                    {report.doctor_name && (
                      <span className="flex items-center">
                        <Activity className="h-4 w-4 mr-1.5" />
                        Ordered by{' '}
                        <span className="ml-1 font-medium text-slate-700">{report.doctor_name}</span>
                      </span>
                    )}
                    {report.prediction?.confidence != null && (
                      <span className="text-slate-400">
                        Confidence: {report.prediction.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}