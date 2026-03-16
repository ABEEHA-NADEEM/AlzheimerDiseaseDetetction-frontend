import React from 'react'
import { User, Mail, Phone, Shield, Camera } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function DoctorProfile() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-3xl font-bold">
                {user?.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-slate-200 text-slate-600 hover:text-teal-600 shadow-sm">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {user?.specialization || 'Neurologist'}
            </p>
            <div className="w-full flex items-center justify-center space-x-2 text-sm text-emerald-600 bg-emerald-50 py-2 rounded-lg">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Verified Doctor</span>
            </div>
          </Card>
        </div>

        {/* Personal Info & Password Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Personal Information
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={user?.name} />
                <Input
                  label="Specialization"
                  defaultValue={user?.specialization || 'Neurologist'}
                />
                <Input label="Email Address" type="email" defaultValue={user?.email} />
                <Input label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Change Password
            </h3>
            <form className="space-y-4">
              <Input label="Current Password" type="password" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="New Password" type="password" />
                <Input label="Confirm New Password" type="password" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="bg-black text-white" variant="secondary">Update Password</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
