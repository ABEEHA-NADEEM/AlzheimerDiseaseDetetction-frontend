import React, { useState, useEffect, useRef } from 'react'
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
import { usePDFDownload }      from '../../hooks/usePDFDownload'

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

  const [activeTab,  setActiveTab]  = useState('gradcam')
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [sharing,    setSharing]    = useState(false)

  // Temporary object URL created during share — cleaned up after use
  const shareBlobUrl = useRef(null)

  const { downloadPDF, generatePDFBlob, downloading } = usePDFDownload()

  useEffect(() => {
    if (location.state?.result) {
      setResult(normalise(location.state.result))
      setLoading(false)
      return
    }
    authAPI.getScanDetail(scanId)
      .then(data => { setResult(normalise(data)); setLoading(false) })
      .catch(err  => { setError(err.message);     setLoading(false) })
  }, [scanId, location.state])

  // Clean up any blob URL on unmount
  useEffect(() => {
    return () => {
      if (shareBlobUrl.current) URL.revokeObjectURL(shareBlobUrl.current)
    }
  }, [])

  // ── WhatsApp share ────────────────────────────────────────────────────────
  const handleShare = async () => {
    if (!result) return
    setSharing(true)

    try {
      const patientName  = result.patient?.name  || 'Patient'
      const diagnosis    = result.prediction?.predicted_class || 'N/A'
      const confidence   = result.prediction?.confidence ?? ''
      const date         = result.created_at || new Date().toLocaleDateString()

      // Try Web Share API first (mobile, works on Android Chrome / Safari iOS)
      if (typeof navigator.share === 'function') {
        // Try to share the PDF file directly if generatePDFBlob is available
        if (typeof generatePDFBlob === 'function') {
          try {
            const blob = await generatePDFBlob(result)
            const file = new File(
              [blob],
              `MRI_Report_${patientName.replace(/\s+/g, '_')}_${scanId}.pdf`,
              { type: 'application/pdf' }
            )
            if (navigator.canShare?.({ files: [file] })) {
              await navigator.share({
                title: `MRI Report — ${patientName}`,
                text:  buildMessage(patientName, diagnosis, confidence, date, scanId),
                files: [file],
              })
              setSharing(false)
              return
            }
          } catch {
            // fall through to text-only share
          }
        }

        // Text-only share (no file)
        await navigator.share({
          title: `MRI Report — ${patientName}`,
          text:  buildMessage(patientName, diagnosis, confidence, date, scanId),
        })
        setSharing(false)
        return
      }

      // Desktop fallback: download PDF then open WhatsApp web with message
      if (typeof generatePDFBlob === 'function') {
        const blob    = await generatePDFBlob(result)
        const url     = URL.createObjectURL(blob)
        shareBlobUrl.current = url

        // Trigger download
        const a       = document.createElement('a')
        a.href        = url
        a.download    = `MRI_Report_${patientName.replace(/\s+/g, '_')}_${scanId}.pdf`
        a.click()
      }

      // Open WhatsApp web with pre-filled message
      const msg = buildMessage(patientName, diagnosis, confidence, date, scanId)
      window.open(
        `https://wa.me/?text=${encodeURIComponent(msg)}`,
        '_blank',
        'noopener,noreferrer'
      )
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    } finally {
      setSharing(false)
    }
  }

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
          {/* ── Share / WhatsApp button ── */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleShare}
            disabled={sharing}
            title="Share via WhatsApp (desktop: downloads PDF + opens WhatsApp)"
          >
            {sharing
              ? <Loader className="h-4 w-4 animate-spin" />
              : <Share2 className="h-4 w-4" />
            }
            {sharing ? 'Sharing…' : 'Share'}
          </Button>

          {/* ── Download PDF button ── */}
          <Button
            className="gap-2"
            onClick={() => downloadPDF(result)}
            disabled={downloading}
          >
            {downloading
              ? <Loader className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />
            }
            {downloading ? 'Generating…' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Patient Details
            </h3>
            <div className="space-y-3">
              <Row label="Name"         value={patient?.name   || '—'} />
              <Row label="Age / Gender" value={`${patient?.age || '—'} / ${patient?.gender || '—'}`} />
              <Row label="Scan Date"    value={result.created_at || new Date().toLocaleDateString()} />
              {result.doctor_name && <Row label="Ordered by" value={result.doctor_name} />}
            </div>
          </Card>

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
              <ConfidenceMeter confidence={prediction.confidence} diagnosis={prediction.predicted_class} />
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

        {/* Right panel */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
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
                  {activeTab === 'gradcam' && (
                    <TabSection title="Grad-CAM Heatmap" description="Highlights regions most influential to the prediction.">
                      <HeatmapViewer gradCamBase64={explanations.gradcam} />
                    </TabSection>
                  )}
                  {activeTab === 'shap' && (
                    <TabSection title="SHAP Analysis" description="Feature importance for this prediction.">
                      {explanations.shap
                        ? <img src={`data:image/png;base64,${explanations.shap}`} alt="SHAP" className="w-full rounded-xl border border-slate-200" />
                        : <EmptyState text="SHAP not available" />}
                    </TabSection>
                  )}
                  {activeTab === 'lime' && (
                    <TabSection title="LIME Explanation" description="Local explanation for this specific scan.">
                      {explanations.lime
                        ? <img src={`data:image/png;base64,${explanations.lime}`} alt="LIME" className="w-full rounded-xl border border-slate-200" />
                        : <EmptyState text="LIME not available" />}
                    </TabSection>
                  )}
                  {activeTab === 'counterfactual' && (
                    <TabSection title="Counterfactual Analysis" description="What would need to change for a different prediction?">
                      <CounterfactualPanel originalDiagnosis={prediction.predicted_class} counterfactualDiagnosis="Normal" changes={[]} />
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

// ── Helpers ────────────────────────────────────────────────────────────────

function buildMessage(patientName, diagnosis, confidence, date, scanId) {
  return (
    `🧠 *MRI Diagnosis Report*\n\n` +
    `👤 Patient: ${patientName}\n` +
    `📋 Diagnosis: ${diagnosis}${confidence ? ` (${confidence}% confidence)` : ''}\n` +
    `📅 Date: ${date}\n` +
    `🔖 Scan ID: ${scanId}\n\n` +
    `Open your medical app to view detailed analysis and heatmaps.`
  )
}

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

function normalise(raw) {
  if (raw.prediction && raw.explanations && raw.patient) return raw
  return {
    scan_id:      raw.scan_id,
    created_at:   raw.created_at || new Date().toLocaleDateString(),
    doctor_name:  raw.doctor_name || null,
    patient:      raw.patient     || {},
    prediction:   raw.prediction  || {},
    explanations: raw.explanations || {},
  }
}