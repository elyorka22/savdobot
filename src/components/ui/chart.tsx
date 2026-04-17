"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export interface ChartProps {
  data: any[]
  xKey: string
  yKey: string
  height?: number
  className?: string
}

export function Chart({ data, xKey, yKey, height = 300, className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
          <YAxis axisLine={false} tickLine={false} hide />
          <Tooltip />
          <Bar dataKey={yKey} fill="#268FDF" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
