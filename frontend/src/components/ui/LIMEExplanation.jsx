import React from 'react'
import { motion } from 'framer-motion'

export function LIMEExplanation({ features }) {

  const maxWeight = Math.max(...features.map((f) => Math.abs(f.weight)))

  return (
    <div className="space-y-4">

      <div className="flex justify-between text-xs text-slate-500 mb-2 px-2">
        <span>Supports Normal</span>
        <span>Supports Alzheimer's</span>
      </div>

      <div className="relative border-l border-slate-200 ml-[50%]">

        {features.map((feature, idx) => {

          const width = (Math.abs(feature.weight) / maxWeight) * 100
          const isPositive = feature.direction === 'positive'

          return (
            <motion.div
              key={feature.name}
              initial={{
                opacity: 0,
                x: isPositive ? -20 : 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: idx * 0.1,
              }}
              className="relative flex items-center h-10 mb-3"
            >

              {/* Label */}
              <div
                className={`absolute w-1/2 px-4 text-sm font-medium text-slate-700 ${
                  isPositive ? 'right-full text-right' : 'left-full text-left'
                }`}
              >
                {feature.name}
              </div>

              {/* Bar */}
              <div
                className={`absolute h-6 rounded-sm ${
                  isPositive
                    ? 'bg-rose-400 right-0 rounded-l-none'
                    : 'bg-emerald-400 left-0 rounded-r-none'
                }`}
                style={{
                  width: `${width}%`,
                }}
              />

              {/* Value */}
              <div
                className={`absolute text-xs font-bold text-white px-2 ${
                  isPositive ? 'right-0' : 'left-0'
                }`}
              >
                {feature.weight.toFixed(2)}
              </div>

            </motion.div>
          )
        })}

      </div>
    </div>
  )
}