import React from 'react'
import { motion } from 'framer-motion'

export function ConfidenceMeter({ confidence, diagnosis }) {

  const getColor = () => {
    if (diagnosis === 'Normal') return 'bg-emerald-500'
    if (diagnosis === 'MCI') return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const getTextColor = () => {
    if (diagnosis === 'Normal') return 'text-emerald-700'
    if (diagnosis === 'MCI') return 'text-amber-700'
    return 'text-rose-700'
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-slate-700">
          AI Confidence
        </span>

        <span className={`text-2xl font-bold ${getTextColor()}`}>
          {confidence}%
        </span>
      </div>

      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
    </div>
  )
}