import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, Share2, FileText, Brain, Activity, Layers, Loader } from 'lucide-react'
import { Card }                from '../../components/ui/Card'
import { Button }              from '../../components/ui/Button'
import { Badge }               from '../../components/ui/Badge'
import { ConfidenceMeter }     from '../../components/ui/ConfidenceMeter'
import { HeatmapViewer }       from '../../components/ui/HeatmapViewer'
import { CounterfactualPanel } from '../../components/ui/CounterfactualPanel'
import { authAPI }             from '../../services/api'

// Badge colour by diagnosis
const BADGE_MAP = {
  Alzheimer: 'danger',
  MCI:       'warning',
  Normal:    'success',
  CN:        'success',
}

const TABS = [
  { id: 'gradcam',        label: 'Grad-CAM',      icon: Brain    },
  { id: 'shap',           label: 'SHAP Analysis', icon: Activity },
  { id: 'lime',           label: 'LIME',          icon: FileText },
  { id: 'counterfactual', label: 'What-If',       icon: Layers   },
]

export function PredictionResults() {
  const { scanId } = useParams()
  const navigate   = useNavigate()
  const location   = useLocation()

  const [activeTab, setActiveTab] = useState('gradcam')
  const [result,    setResult]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  useEffect(() => {
    // Prefer result passed via navigate state (avoids extra round-trip)
    if (location.state?.result) {
      // Normalise shape — doctor flow nests prediction inside result directly,
      // patient flow nests it inside result.prediction.
      const raw = location.state.result
      setResult(normalise(raw))
      setLoading(false)
      return
    }

    // Fallback: fetch from API (e.g. direct URL access or page refresh)
    authAPI.getScanDetail(scanId)
      .then(data => { setResult(normalise(data)); setLoading(false) })
      .catch(err  => { setError(err.message);     setLoading(false) })
  }, [scanId, location.state])

  // Determine back-navigation based on role stored in localStorage
  const role     = localStorage.getItem('role') || 'doctor'
  const backPath = role === 'patient' ? '/patient/reports' : '/doctor/dashboard'

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  )

  if (error || !result) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <p className="text-rose-600">{error || 'Result not found.'}</p>
      <Button onClick={() => navigate(backPath)}>Go Back</Button>
    </div>
  )

  const { prediction, explanations, patient } = result

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(backPath)}
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

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left panel */}
        <div className="lg:col-span-1 space-y-6">

          {/* Patient details */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Patient Details
            </h3>
            <div className="space-y-3">
              <Row label="Name"        value={patient?.name   || '—'} />
              <Row label="Age / Gender"
                   value={`${patient?.age || '—'} / ${patient?.gender || '—'}`} />
              <Row label="Scan Date"   value={result.created_at || new Date().toLocaleDateString()} />
              {result.doctor_name && (
                <Row label="Ordered by" value={result.doctor_name} />
              )}
            </div>
          </Card>

          {/* AI Diagnosis */}
          <Card className="p-6 border-t-4 border-t-rose-500">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              AI Diagnosis
            </h3>
            <div className="mb-6">
              <Badge
                variant={BADGE_MAP[prediction.predicted_class] || 'default'}
                className="text-lg px-4 py-1 mb-4"
              >
                {prediction.predicted_class}
              </Badge>
              <ConfidenceMeter
                confidence={prediction.confidence}
                diagnosis={prediction.predicted_class}
              />
            </div>

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

        {/* Right panel — visualisations */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto px-2">
                {TABS.map(tab => (
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

            {/* Tab content */}
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

                  {/* Grad-CAM */}
                  {activeTab === 'gradcam' && (
                    <TabSection
                      title="Grad-CAM Heatmap"
                      description="Highlights regions most influential to the prediction."
                    >
                      <HeatmapViewer gradCamBase64={explanations.gradcam} />
                    </TabSection>
                  )}

                  {/* SHAP */}
                  {activeTab === 'shap' && (
                    <TabSection
                      title="SHAP Analysis"
                      description="Feature importance for this prediction."
                    >
                      {explanations.shap
                        ? <img
                            src={`data:image/png;base64,${explanations.shap}`}
                            alt="SHAP explanation"
                            className="w-full rounded-xl border border-slate-200"
                          />
                        : <EmptyState text="SHAP not available" />
                      }
                    </TabSection>
                  )}

                  {/* LIME */}
                  {activeTab === 'lime' && (
                    <TabSection
                      title="LIME Explanation"
                      description="Local explanation for this specific scan."
                    >
                      {explanations.lime
                        ? <img
                            src={`data:image/png;base64,${explanations.lime}`}
                            alt="LIME explanation"
                            className="w-full rounded-xl border border-slate-200"
                          />
                        : <EmptyState text="LIME not available" />
                      }
                    </TabSection>
                  )}

                  {/* Counterfactual */}
                  {activeTab === 'counterfactual' && (
                    <TabSection
                      title="Counterfactual Analysis"
                      description="What would need to change for a different prediction?"
                    >
                      <CounterfactualPanel
                        originalDiagnosis={prediction.predicted_class}
                        counterfactualDiagnosis="Normal"
                        changes={[]}
                      />
                    </TabSection>
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

// ── Small helpers ─────────────────────────────────────────────────────────────

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  )
}

function TabSection({ title, description, children }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }) {
  return <p className="text-center text-slate-400 py-12">{text}</p>
}

/**
 * Normalises the API response shape into a consistent structure
 * regardless of whether it came from the doctor predict endpoint
 * or the shared scan-detail / patient-reports endpoint.
 */
function normalise(raw) {
  // Already in the right shape (patient-reports / scan-detail)
  if (raw.prediction && raw.explanations && raw.patient) return raw

  // Doctor predict response wraps everything at the top level
  return {
    scan_id:     raw.scan_id,
    created_at:  raw.created_at || new Date().toLocaleDateString(),
    doctor_name: raw.doctor_name || null,
    patient:     raw.patient     || {},
    prediction:  raw.prediction  || {},
    explanations: raw.explanations || {},
  }
}