import React, { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          block w-full rounded-lg border-slate-300 shadow-sm 
          focus:border-teal-500 focus:ring-teal-500 sm:text-sm
          px-4 py-2 border bg-white text-slate-900
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'