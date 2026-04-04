import React from 'react'
import { ArrowRight } from 'lucide-react'

export function CounterfactualPanel({
  originalDiagnosis,
  counterfactualDiagnosis,
  changes,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-1">Original Prediction</p>
          <p className="text-xl font-bold text-rose-600">
            {originalDiagnosis}
          </p>
        </div>

        <ArrowRight className="h-8 w-8 text-slate-400" />

        <div className="text-center">
          <p className="text-sm text-slate-500 mb-1">What-If Prediction</p>
          <p className="text-xl font-bold text-emerald-600">
            {counterfactualDiagnosis}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-4">
          Required Changes for Different Diagnosis:
        </h4>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Original Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Required Value
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {changes.map((change, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {change.feature}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {change.original}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-600 bg-teal-50/50">
                    {change.new}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}