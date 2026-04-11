import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { authAPI } from '../../services/api'

export function DoctorApprovals() {
  const [doctors,  setDoctors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    fetchPendingDoctors()
  }, [])

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true)
      const data = await authAPI.getPendingDoctors()  // ← fixed
      if (Array.isArray(data)) {
        setDoctors(data)
      } else {
        setError('Failed to load pending doctors.')
      }
    } catch {
      setError('Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    setActionId(userId)
    try {
      await authAPI.approveDoctor(userId)
      setDoctors(prev => prev.filter(d => d.id !== userId))
    } catch {
      setError('Failed to approve doctor.')
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (userId) => {
    setActionId(userId)
    try {
      await authAPI.rejectDoctor(userId)
      setDoctors(prev => prev.filter(d => d.id !== userId))
    } catch {
      setError('Failed to reject doctor.')
    } finally {
      setActionId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Approvals</h1>
        <p className="text-slate-500 mt-1">Review and approve new doctor registrations.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
          <p className="text-sm font-medium text-rose-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {doctors.map((doc, idx) => (
          <Card key={doc.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-700">Email:</span> {doc.email}</p>
                  <p><span className="font-medium text-slate-700">Specialization:</span> {doc.specialization || 'Not specified'}</p>
                  <p><span className="font-medium text-slate-700">Joined:</span> {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto shrink-0">
                <Button
                  variant="outline"
                  onClick={() => handleReject(doc.id)}
                  disabled={actionId === doc.id}
                  className="flex-1 md:flex-none text-rose-600 hover:bg-rose-50 hover:border-rose-200 gap-2"
                >
                  {actionId === doc.id
                    ? <Loader className="h-4 w-4 animate-spin" />
                    : <XCircle className="h-4 w-4" />
                  }
                  Reject
                </Button>

                <Button
                  onClick={() => handleApprove(doc.id)}
                  disabled={actionId === doc.id}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  {actionId === doc.id
                    ? <Loader className="h-4 w-4 animate-spin" />
                    : <CheckCircle className="h-4 w-4" />
                  }
                  Approve
                </Button>
              </div>

            </div>
          </Card>
        ))}

        {doctors.length === 0 && !error && (
          <Card className="p-12 text-center text-slate-500">
            ✅ No pending approvals at this time.
          </Card>
        )}
      </div>
    </div>
  )
}