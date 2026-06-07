import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-base font-semibold font-heading mb-4">Sales Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 55%, 38%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 55%, 38%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(150, 10%, 45%)' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(150, 10%, 45%)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            <Area type="monotone" dataKey="sales" stroke="hsl(152, 55%, 38%)" fill="url(#salesGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
