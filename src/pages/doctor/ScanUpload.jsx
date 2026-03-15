import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, User, Brain, CheckCircle, ArrowRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FileUpload } from '../../components/ui/FileUpload'

export function ScanUpload() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (step === 3 && !isProcessing) {
      setIsProcessing(true)
      const timer = setTimeout(() => {
        navigate('/doctor/results/mock-scan-123')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step, isProcessing, navigate])

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload New Scan</h1>
        <p className="text-slate-500 mt-1">
          Enter patient details and upload MRI scan for AI analysis.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{
              width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
            }}
          />
        </div>

        {[
          { num: 1, label: 'Patient Info', icon: User },
          { num: 2, label: 'Upload MRI', icon: Upload },
          { num: 3, label: 'Analysis', icon: Brain },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors bg-white
              ${step >= s.num ? 'border-teal-500 text-teal-600' : 'border-slate-300 text-slate-400'}
              ${step > s.num ? 'bg-teal-500 text-white' : ''}`}
            >
              {step > s.num ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-slate-900' : 'text-slate-500'}`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-slate-900">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Patient ID (Optional)" placeholder="e.g. PT-1029" />
                <Input label="Full Name" placeholder="John Doe" />
                <Input label="Age" type="number" placeholder="65" />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-2 border bg-white text-slate-900">
                    <option>Select...</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
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

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-slate-900">Upload MRI Scan</h2>
              <FileUpload onFileSelect={() => {}} maxSize={50} />
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Analyze Scan <Brain className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

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
                <h3 className="text-lg font-semibold text-slate-900">Analyzing MRI Data...</h3>
                <p className="text-slate-500 mt-2">
                  Running deep learning models for diagnosis.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}