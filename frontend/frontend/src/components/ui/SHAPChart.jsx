import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export function SHAPChart({ data }) {

  // Sort data by absolute value descending
  const sortedData = [...data].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value)
  )

  return (
    <div className="w-full h-100">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 100,
            bottom: 5,
          }}
        >

          <XAxis type="number" hide />

          <YAxis
            dataKey="feature"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12,
            }}
            width={120}
          />

          <Tooltip
            cursor={{
              fill: '#f1f5f9',
            }}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />

          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > 0 ? '#0891b2' : '#0ea5e9'}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  )
}