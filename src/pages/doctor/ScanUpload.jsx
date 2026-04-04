import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, User, Brain, CheckCircle, ArrowRight, Search, ChevronDown, X } from 'lucide-react'
import { Card }       from '../../components/ui/Card'
import { Button }     from '../../components/ui/Button'
import { Input }      from '../../components/ui/Input'
import { FileUpload } from '../../components/ui/FileUpload'
import { authAPI }    from '../../services/api'

export function ScanUpload() {
  const [step,         setStep]         = useState(1)
  const [error,        setError]        = useState('')

  // Patient info
  const [patientName,   setPatientName]   = useState('')
  const [patientAge,    setPatientAge]    = useState('')
  const [patientGender, setPatientGender] = useState('')
  const [patientId,     setPatientId]     = useState('')

  // Patient picker
  const [patients,        setPatients]        = useState([])
  const [patientSearch,   setPatientSearch]   = useState('')
  const [showDropdown,    setShowDropdown]    = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [patientError,    setPatientError]    = useState('')

  // File
  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

  // ── Load patient list ───────────────────────────────────
  useEffect(() => {
    setLoadingPatients(true)
    setPatientError('')

    authAPI.getPatientList()
      .then(data => {
        console.log('Patient list response:', data)   // check browser console
        const list = data.patients || []
        setPatients(list)
        if (list.length === 0) {
          setPatientError('No registered patients found.')
        }
      })
      .catch(err => {
        console.error('Failed to load patients:', err)
        setPatientError('Could not load patients: ' + (err.message || 'Unknown error'))
      })
      .finally(() => setLoadingPatients(false))
  }, [])

  // ── Filter patients by search ───────────────────────────
  const filteredPatients = patients.filter(p => {
    const full = `${p.first_name || ''} ${p.last_name || ''} ${p.email || ''}`.toLowerCase()
    return full.includes(patientSearch.toLowerCase())
  })

  const selectPatient = (p) => {
    const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.email
    setPatientId(String(p.id))
    setPatientName(name)
    setPatientSearch(name)
    setShowDropdown(false)
  }

  const clearPatient = () => {
    setPatientId('')
    setPatientName('')
    setPatientSearch('')
  }

  // ── Submit ──────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload an MRI image first.')
      return
    }

    setStep(3)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image',          selectedFile)
      formData.append('patient_name',   patientName)
      formData.append('patient_age',    patientAge)
      formData.append('patient_gender', patientGender)
      if (patientId) formData.append('patient_id', patientId)

      const result = await authAPI.predict(formData)

      navigate(`/doctor/results/${result.scan_id}`, {
        state: { result }
      })

    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
      setStep(2)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload New Scan</h1>
        <p className="text-slate-500 mt-1">Enter patient details and upload MRI scan for AI analysis.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />
        </div>
        {[
          { num: 1, label: 'Patient Info', icon: User   },
          { num: 2, label: 'Upload MRI',   icon: Upload },
          { num: 3, label: 'Analysis',     icon: Brain  },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors bg-white
              ${step >= s.num ? 'border-teal-500 text-teal-600' : 'border-slate-300 text-slate-400'}
              ${step > s.num  ? 'bg-teal-500 text-white border-teal-500' : ''}`}
            >
              {step > s.num ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </div>
            <span className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-slate-900' : 'text-slate-500'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
          <p className="text-sm font-medium text-rose-800">{error}</p>
        </div>
      )}

      <Card className="p-8">
        <AnimatePresence mode="wait">

          {/* ── Step 1 — Patient Info ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-slate-900">Patient Information</h2>

              {/* ── Patient Picker ── */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Registered Patient
                  <span className="text-slate-400 font-normal ml-1">
                    (lets patient view results in their portal)
                  </span>
                </label>

                {loadingPatients && (
                  <p className="text-sm text-slate-400 py-2">Loading patients…</p>
                )}

                {!loadingPatients && patientError && (
                  <p className="text-sm text-rose-500 py-2">{patientError}</p>
                )}

                {!loadingPatients && (
                  <div className="relative">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder={
                          patients.length === 0
                            ? 'No patients registered yet'
                            : `Search among ${patients.length} patient(s)…`
                        }
                        value={patientSearch}
                        disabled={patients.length === 0}
                        onChange={(e) => {
                          setPatientSearch(e.target.value)
                          setShowDropdown(true)
                          if (!e.target.value) clearPatient()
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm
                          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                          disabled:bg-slate-50 disabled:text-slate-400"
                      />
                      {patientId
                        ? <button
                            onClick={clearPatient}
                            className="absolute right-3 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        : <ChevronDown className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
                      }
                    </div>

                    {/* Dropdown */}
                    {showDropdown && !patientId && patients.length > 0 && (
                      <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-200
                        rounded-lg shadow-lg max-h-52 overflow-y-auto">
                        {(patientSearch ? filteredPatients : patients).length === 0 ? (
                          <li className="px-4 py-3 text-sm text-slate-400 text-center">
                            No patients match "{patientSearch}"
                          </li>
                        ) : (
                          (patientSearch ? filteredPatients : patients).map(p => (
                            <li
                              key={p.id}
                              onMouseDown={() => selectPatient(p)}
                              className="px-4 py-3 text-sm hover:bg-teal-50 cursor-pointer
                                border-b border-slate-50 last:border-0"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-800">
                                    {[p.first_name, p.last_name].filter(Boolean).join(' ') || '—'}
                                  </span>
                                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    ID: {p.id}
                                  </span>
                                </div>
                                <span className="text-slate-400 text-xs">{p.email}</span>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    )}

                    {/* Linked confirmation */}
                    {patientId && (
                      <p className="mt-1.5 text-xs text-teal-600 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Linked — patient will see this result in their portal
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Manual fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
                <Input
                  label="Age"
                  type="number"
                  placeholder="65"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500
                      focus:ring-teal-500 sm:text-sm px-4 py-2 border bg-white text-slate-900"
                  >
                    <option value="">Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button onClick={() => setStep(2)} className="gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2 — Upload MRI ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-slate-900">Upload MRI Scan</h2>
              <FileUpload
                onFileSelect={(file) => setSelectedFile(file)}
                maxSize={50}
              />
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile}
                  className="gap-2"
                >
                  Analyze Scan <Brain className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3 — Processing ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-4 border-teal-100 animate-ping opacity-75" />
                <div className="relative bg-teal-500 p-6 rounded-full text-white">
                  <Brain className="h-12 w-12 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">Analyzing MRI Data…</h3>
                <p className="text-slate-500 mt-2">Running deep learning models for diagnosis.</p>
                <p className="text-xs text-slate-400 mt-1">This may take 30–60 seconds</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </Card>
    </div>
  )
}