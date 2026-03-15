import React from 'react';
import { Users, CheckCircle, XCircle, Activity, Shield } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'framer-motion';

const pendingDoctors = [
  {
    id: '1',
    name: 'Dr. James Wilson',
    email: 'j.wilson@hospital.com',
    date: '2023-10-25',
    specialization: 'Neurologist',
  },
  {
    id: '2',
    name: 'Dr. Emily Chen',
    email: 'e.chen@clinic.org',
    date: '2023-10-24',
    specialization: 'Radiologist',
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-500 mt-1">
            Manage users, approvals, and system health.
          </p>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-semibold text-slate-900">1,248</p>
            </div>
            <div className="p-3 rounded-lg bg-navy-50 text-navy-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Doctors</p>
              <p className="text-2xl font-semibold text-slate-900">42</p>
            </div>
            <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Scans</p>
              <p className="text-2xl font-semibold text-slate-900">8,432</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
              <p className="text-2xl font-semibold text-amber-600">2</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Doctor Approvals (span full width on large screens) */}
        <Card className="lg:col-span-2">
            <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
                Pending Doctor Approvals
            </h2>
            </div>
            <div className="p-0">
            {pendingDoctors.length > 0 ? (
                <div className="divide-y divide-slate-100">
                {pendingDoctors.map((doc, idx) => (
                    <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-6 flex items-center justify-between hover:bg-slate-50"
                    >
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">{doc.name}</h4>
                        <p className="text-sm text-slate-500">{doc.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                        <Badge variant="default">{doc.specialization}</Badge>
                        <span className="text-xs text-slate-400">Applied: {doc.date}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                        variant="outline"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                        >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                    </div>
                    </motion.div>
                ))}
                </div>
            ) : (
                <div className="p-8 text-center text-slate-500">No pending approvals.</div>
            )}
            </div>
        </Card>
        </div>
    </div>
  );
}