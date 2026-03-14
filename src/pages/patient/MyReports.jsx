import React from 'react'
import { FileText, Download, Calendar, Eye } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const MOCK_REPORTS = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    doctor: 'Dr. Sarah Chen',
    diagnosis: 'MCI',
    summary:
      'Mild cognitive impairment detected. Follow-up recommended in 6 months.',
  },
  {
    id: '2',
    date: 'Nov 15, 2022',
    doctor: 'Dr. Sarah Chen',
    diagnosis: 'Normal',
    summary:
      'No significant abnormalities detected. Age-appropriate brain volume.',
  },
]

export function MyReports() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
        <p className="text-slate-500 mt-1">
          View and download your diagnostic reports shared by your doctor.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_REPORTS.map((report) => (
          <Card key={report.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl hidden sm:block">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      MRI Analysis Report
                    </h3>
                    <Badge variant="info">{report.diagnosis}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 gap-4 mb-3">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> {report.date}
                    </span>
                    <span className="flex items-center">
                      Ordered by {report.doctor}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Summary:</span>{' '}
                    {report.summary}
                  </p>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                <Button variant="primary" className="gap-2 w-full justify-center">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" className="gap-2 w-full justify-center">
                  <Eye className="h-4 w-4" /> View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
