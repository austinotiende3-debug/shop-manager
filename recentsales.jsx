import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';

const methodColors = {
  cash: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  mpesa: 'bg-green-500/10 text-green-700 border-green-200',
  bank: 'bg-blue-500/10 text-blue-700 border-blue-200',
  card: 'bg-purple-500/10 text-purple-700 border-purple-200',
  credit: 'bg-orange-500/10 text-orange-700 border-orange-200',
};

export default function RecentSales({ sales }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold font-heading mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-muted-foreground">
          <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No recent transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-base font-semibold font-heading mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {sales.slice(0, 8).map(sale => (
          <div key={sale.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{sale.invoice_number}</p>
                <p className="text-xs text-muted-foreground">
                  {sale.customer_name || 'Walk-in'} • {format(new Date(sale.created_date), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">KES {sale.total_amount?.toLocaleString()}</p>
              <Badge variant="outline" className={`text-[10px] ${methodColors[sale.payment_method] || ''}`}>
                {sale.payment_method?.toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
