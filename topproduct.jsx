import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopProducts({ sales }) {
  const productSales = {};
  (sales || []).forEach(sale => {
    (sale.items || []).forEach(item => {
      const name = item.product_name || 'Unknown';
      productSales[name] = (productSales[name] || 0) + (item.quantity || 0);
    });
  });

  const data = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, qty]) => ({ name: name.length > 12 ? name.substring(0, 12) + '...' : name, qty }));

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold font-heading mb-4">Top Products</h3>
        <p className="text-sm text-muted-foreground text-center py-8">No sales data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-base font-semibold font-heading mb-4">Top Selling Products</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            <Bar dataKey="qty" fill="hsl(152, 55%, 38%)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
