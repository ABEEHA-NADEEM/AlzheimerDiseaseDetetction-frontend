import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from './Button'

export function HeatmapViewer({ gradCamBase64 }) {
  const [showOverlay, setShowOverlay] = useState(true)

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-slate-900 shadow-inner border border-slate-200">

        {gradCamBase64 ? (
          // ── Real GradCAM image from backend ────────────
          <img
            src={`data:image/png;base64,${gradCamBase64}`}
            alt="GradCAM Heatmap"
            className="w-full h-full object-contain"
          />
        ) : (
          // ── Fallback mockup if no image ─────────────────
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-600 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-slate-400 rounded-[40%] blur-sm opacity-50" />
            {showOverlay && (
              <div className="absolute inset-0 mix-blend-screen opacity-70">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-rose-500 via-amber-500 to-transparent blur-xl rounded-full" />
              </div>
            )}
          </div>
        )}

      </div>

      <div className="flex items-center justify-between w-full max-w-md px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
        <span className="text-sm font-medium text-slate-700">Grad-CAM Overlay</span>
        {!gradCamBase64 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOverlay(!showOverlay)}
            className="gap-2"
          >
            {showOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showOverlay ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
    </div>
  )
}