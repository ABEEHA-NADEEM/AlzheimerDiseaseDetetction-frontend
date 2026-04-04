import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  Brain,
  Activity,
  Layers,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ConfidenceMeter } from '../../components/ui/ConfidenceMeter'
import { HeatmapViewer } from '../../components/ui/HeatmapViewer'
import { SHAPChart } from '../../components/ui/SHAPChart'
import { LIMEExplanation } from '../../components/ui/LIMEExplanation'
import { CounterfactualPanel } from '../../components/ui/CounterfactualPanel'

const MOCK_SHAP_DATA = [
  { feature: 'Hippocampus Volume', value: 0.85 },
  { feature: 'Ventricle Ratio', value: 0.72 },
  { feature: 'Cortical Thickness', value: -0.45 },
  { feature: 'White Matter Lesions', value: 0.55 },
  { feature: 'Brain Volume', value: -0.35 },
  { feature: 'Temporal Lobe Atrophy', value: 0.82 },
]

const MOCK_LIME_DATA = [
  { name: 'Hippocampal Atrophy', weight: 0.45, direction: 'positive' },
  { name: 'Enlarged Ventricles', weight: 0.32, direction: 'positive' },
  { name: 'Age > 65', weight: 0.15, direction: 'positive' },
  { name: 'Normal Cortical Thickness', weight: 0.22, direction: 'negative' },
]

const MOCK_COUNTERFACTUAL = [
  { feature: 'Hippocampus Volume', original: '2.1 cm³ (Low)', new: '> 3.0 cm³' },
  { feature: 'Ventricle Ratio', original: '0.45 (High)', new: '< 0.30' },
]

export function PredictionResults() {
  const { scanId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('gradcam')

  const tabs = [
    { id: 'gradcam', label: 'Grad-CAM', icon: Brain },
    { id: 'shap', label: 'SHAP Analysis', icon: Activity },
    { id: 'lime', label: 'LIME', icon: FileText },
    { id: 'counterfactual', label: 'What-If', icon: Layers },
  ]

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
            <p className="text-slate-500 mt-1">Scan ID: {scanId || 'SCN-2023-1029'}</p>
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
        {/* Patient & Summary Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Patient Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Name</span>
                <span className="font-medium text-slate-900">Robert Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Age / Gender</span>
                <span className="font-medium text-slate-900">72 / Male</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Scan Date</span>
                <span className="font-medium text-slate-900">Oct 24, 2023</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-t-4 border-t-rose-500">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">AI Diagnosis</h3>
            <div className="mb-6">
              <Badge variant="danger" className="text-lg px-4 py-1 mb-4">
                Alzheimer's Disease
              </Badge>
              <ConfidenceMeter confidence={89} diagnosis="Alzheimer" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The model indicates a high probability of Alzheimer's Disease,
              primarily driven by significant hippocampal atrophy and enlarged
              ventricles observed in the MRI scan.
            </p>
          </Card>
        </div>

        {/* Visualizations Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                      ${activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Panels */}
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
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Grad-CAM Heatmap</h3>
                        <p className="text-sm text-slate-500">
                          Highlights regions of the brain most influential to the model's prediction.
                        </p>
                      </div>
                      <HeatmapViewer />
                    </div>
                  )}

                  {activeTab === 'shap' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">SHAP Feature Importance</h3>
                        <p className="text-sm text-slate-500">
                          Global impact of clinical and imaging features on the diagnosis.
                        </p>
                      </div>
                      <SHAPChart data={MOCK_SHAP_DATA} />
                    </div>
                  )}

                  {activeTab === 'lime' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">LIME Local Explanation</h3>
                        <p className="text-sm text-slate-500">
                          Local linear approximation of the model around this specific patient's data.
                        </p>
                      </div>
                      <div className="max-w-lg mx-auto w-full bg-white p-6 rounded-xl border border-slate-200">
                        <LIMEExplanation features={MOCK_LIME_DATA} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'counterfactual' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Counterfactual Analysis</h3>
                        <p className="text-sm text-slate-500">
                          What would need to change for the model to predict 'Normal' instead?
                        </p>
                      </div>
                      <CounterfactualPanel
                        originalDiagnosis="Alzheimer's"
                        counterfactualDiagnosis="Normal"
                        changes={MOCK_COUNTERFACTUAL}
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