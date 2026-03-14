import React from 'react'
import { User, Camera } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function PatientProfile() {
  const { user } = useAuth()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your personal information.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl font-bold">
              {user?.name.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-slate-200 text-slate-600 hover:text-teal-600 shadow-sm">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-slate-500">Patient Account</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Full Name" defaultValue={user?.name} />
            <Input label="Date of Birth" type="date" defaultValue="1951-05-14" />
            <Input label="Email Address" type="email" defaultValue={user?.email} />
            <Input label="Phone Number" type="tel" defaultValue="+1 (555) 987-6543" />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
