import React from 'react';
import { AlertTriangle, Package, XCircle, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LowStockAlert({ products }) {
  const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_level && p.status === 'active') || [];
  const outOfStock = lowStock.filter(p => p.stock_quantity === 0);
  const critical = lowStock.filter(p => p.stock_quantity > 0 && p.stock_quantity <= Math.ceil(p.min_stock_level * 0.5));
  const low = lowStock.filter(p => p.stock_quantity > Math.ceil(p.min_stock_level * 0.5));

  if (lowStock.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold font-heading">Stock Alerts</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-emerald-700">All stock levels healthy</p>
        </div>
      </div>
    );
  }

  const getBar = (qty, min) => {
    const pct = min > 0 ? Math.min((qty / min) * 100, 100) : 100;
    const color = qty === 0 ? 'bg-red-500' : pct <= 50 ? 'bg-orange-500' : 'bg-yellow-400';
    return { pct, color };
  };

  return (
    <div className="bg-card rounded-xl border border-red-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="text-base font-semibold font-heading">Stock Alerts</h3>
        </div>
        <Badge className="bg-red-500 text-white border-0">{lowStock.length} items</Badge>
      </div>

      {/* Summary pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {outOfStock.length > 0 && (
          <div className="flex items-center gap-1.5 bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            {outOfStock.length} Out of Stock
          </div>
        )}
        {critical.length > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            {critical.length} Critical
          </div>
        )}
        {low.length > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-xs font-semibold">
            <TrendingDown className="w-3.5 h-3.5" />
            {low.length} Low
          </div>
        )}
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {lowStock.slice(0, 8).map(p => {
          const { pct, color } = getBar(p.stock_quantity, p.min_stock_level);
          const isOut = p.stock_quantity === 0;
          const isCritical = !isOut && pct <= 50;

          return (
            <div key={p.id} className={`rounded-lg p-3 border transition-all ${
              isOut ? 'bg-red-50 border-red-200' :
              isCritical ? 'bg-orange-50 border-orange-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {isOut
                    ? <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    : <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  }
                  <p className="text-sm font-medium truncate">{p.name}</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <span className={`text-sm font-bold ${isOut ? 'text-red-700' : isCritical ? 'text-orange-700' : 'text-yellow-700'}`}>
                    {isOut ? 'OUT' : `${p.stock_quantity}`}
                  </span>
                  <span className="text-xs text-muted-foreground"> / {p.min_stock_level} min</span>
                </div>
              </div>
              {/* Stock bar */}
              <div className="w-full bg-white/70 rounded-full h-1.5 overflow-hidden border border-white">
                <div
                  className={`h-full rounded-full transition-all ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{p.category} · Need to reorder</p>
            </div>
          );
        })}
      </div>

      {lowStock.length > 8 && (
        <p className="text-xs text-muted-foreground text-center mt-3">+{lowStock.length - 8} more items need attention</p>
      )}
    </div>
  );
}
