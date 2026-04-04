import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, Share2, FileText, Brain, Activity, Layers, Loader } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ConfidenceMeter } from '../../components/ui/ConfidenceMeter'
import { HeatmapViewer } from '../../components/ui/HeatmapViewer'
import { SHAPChart } from '../../components/ui/SHAPChart'
import { LIMEExplanation } from '../../components/ui/LIMEExplanation'
import { CounterfactualPanel } from '../../components/ui/CounterfactualPanel'

export function PredictionResults() {
  const { scanId }   = useParams()
  const navigate     = useNavigate()
  const location     = useLocation()

  const [activeTab, setActiveTab] = useState('gradcam')
  const [result,    setResult]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  useEffect(() => {
    // Result passed from ScanUpload via navigate state
    if (location.state?.result) {
      setResult(location.state.result)
      setLoading(false)
    } else {
      setError('Result not found.')
      setLoading(false)
    }
  }, [location.state])

  const tabs = [
    { id: 'gradcam',          label: 'Grad-CAM',      icon: Brain    },
    { id: 'shap',             label: 'SHAP Analysis', icon: Activity },
    { id: 'lime',             label: 'LIME',          icon: FileText },
    { id: 'counterfactual',   label: 'What-If',       icon: Layers   },
  ]

  // ── Badge color by diagnosis ──────────────────────────
  const getDiagnosisBadge = (diagnosis) => {
    const map = {
      'Alzheimer':  'danger',
      'MCI':        'warning',
      'Normal':     'success',
      'CN':         'success',
    }
    return map[diagnosis] || 'default'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-rose-600">{error || 'Result not found.'}</p>
        <Button onClick={() => navigate('/doctor/upload')}>Go Back</Button>
      </div>
    )
  }

  const { prediction, explanations, patient } = result

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analysis Results</h1>
            <p className="text-slate-500 mt-1">Scan ID: {scanId}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-6">

          {/* Patient Details */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Patient Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Name</span>
                <span className="font-medium text-slate-900">
                  {patient?.name || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Age / Gender</span>
                <span className="font-medium text-slate-900">
                  {patient?.age || '—'} / {patient?.gender || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Scan Date</span>
                <span className="font-medium text-slate-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* AI Diagnosis */}
          <Card className="p-6 border-t-4 border-t-rose-500">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              AI Diagnosis
            </h3>
            <div className="mb-6">
              <Badge
                variant={getDiagnosisBadge(prediction.predicted_class)}
                className="text-lg px-4 py-1 mb-4"
              >
                {prediction.predicted_class}
              </Badge>
              <ConfidenceMeter
                confidence={prediction.confidence}
                diagnosis={prediction.predicted_class}
              />
            </div>

            {/* All probabilities */}
            <div className="space-y-2 mt-4">
              {Object.entries(prediction.all_probabilities).map(([cls, prob]) => (
                <div key={cls} className="flex justify-between text-sm">
                  <span className="text-slate-600">{cls}</span>
                  <span className="font-medium text-slate-900">{prob}%</span>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Panel — Visualizations */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                      ${activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1 bg-slate-50/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col justify-center"
                >

                  {/* GradCAM — real image from backend */}
                  {activeTab === 'gradcam' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Grad-CAM Heatmap</h3>
                        <p className="text-sm text-slate-500">
                          Highlights regions most influential to the prediction.
                        </p>
                      </div>
                      <HeatmapViewer
                        gradCamBase64={explanations.gradcam}
                      />
                    </div>
                  )}

                  {/* SHAP — real values from backend */}
                  {activeTab === 'shap' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">SHAP Analysis</h3>
                        <p className="text-sm text-slate-500">
                          Feature importance for this prediction.
                        </p>
                      </div>
                      {explanations.shap ? (
                        <img
                          src={`data:image/png;base64,${explanations.shap}`}
                          alt="SHAP explanation"
                          className="w-full rounded-xl border border-slate-200"
                        />
                      ) : (
                        <p className="text-center text-slate-500">SHAP not available</p>
                      )}
                    </div>
                  )}

                  {/* LIME — real values from backend */}
                  {activeTab === 'lime' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">LIME Explanation</h3>
                        <p className="text-sm text-slate-500">
                          Local explanation for this specific scan.
                        </p>
                      </div>
                      {explanations.lime ? (
                        <img
                          src={`data:image/png;base64,${explanations.lime}`}
                          alt="LIME explanation"
                          className="w-full rounded-xl border border-slate-200"
                        />
                      ) : (
                        <p className="text-center text-slate-500">LIME not available</p>
                      )}
                    </div>
                  )}

                  {/* Counterfactual */}
                  {activeTab === 'counterfactual' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Counterfactual Analysis</h3>
                        <p className="text-sm text-slate-500">
                          What would need to change for a different prediction?
                        </p>
                      </div>
                      <CounterfactualPanel
                        originalDiagnosis={prediction.predicted_class}
                        counterfactualDiagnosis="Normal"
                        changes={[]}
                      />
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}