import React from 'react'
import { motion } from 'framer-motion'

export function Card({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}