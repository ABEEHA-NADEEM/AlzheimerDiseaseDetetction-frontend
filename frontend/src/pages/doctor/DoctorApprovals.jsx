import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const PENDING_DOCTORS = [
  {
    id: '1',
    name: 'Dr. James Wilson',
    email: 'j.wilson@hospital.com',
    date: '2023-10-25',
    specialization: 'Neurologist',
    license: 'MD-98765432',
  },
  {
    id: '2',
    name: 'Dr. Emily Chen',
    email: 'e.chen@clinic.org',
    date: '2023-10-24',
    specialization: 'Radiologist',
    license: 'MD-12345678',
  },
]

export function DoctorApprovals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Doctor Approvals
        </h1>
        <p className="text-slate-500 mt-1">
          Review and approve new doctor registrations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {PENDING_DOCTORS.map((doc, idx) => (
          <Card key={doc.id} delay={idx * 0.1} className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {doc.name}
                  </h3>

                  <Badge variant="warning">
                    Pending Review
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">

                  <p>
                    <span className="font-medium text-slate-700">
                      Email:
                    </span>{' '}
                    {doc.email}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      Specialization:
                    </span>{' '}
                    {doc.specialization}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      License No:
                    </span>{' '}
                    {doc.license}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      Applied:
                    </span>{' '}
                    {doc.date}
                  </p>

                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto shrink-0">

                <Button
                  variant="outline"
                  className="flex-1 md:flex-none text-rose-600 hover:bg-rose-50 hover:border-rose-200 gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>

                <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>

              </div>

            </div>
          </Card>
        ))}

        {PENDING_DOCTORS.length === 0 && (
          <Card className="p-12 text-center text-slate-500">
            No pending approvals at this time.
          </Card>
        )}

      </div>
    </div>
  )
}