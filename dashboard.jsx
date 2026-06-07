import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, ShoppingCart, TrendingDown, TrendingUp, Truck, User, Smartphone } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/dashboard/StatCard';
import SalesChart from '@/components/dashboard/SalesChart';
import RecentSales from '@/components/dashboard/RecentSales';
import LowStockAlert from '@/components/dashboard/LowStockAlert';
import TopProducts from '@/components/dashboard/TopProducts';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, format, subDays } from 'date-fns';

export default function Dashboard() {
  const [period, setPeriod] = useState('month');

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-created_date', 500),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => base44.entities.Expense.list('-created_date', 200),
  });

  const stats = useMemo(() => {
    const now = new Date();
    let startDate;
    if (period === 'day') startDate = startOfDay(now);
    else if (period === 'week') startDate = startOfWeek(now);
    else if (period === 'month') startDate = startOfMonth(now);
    else startDate = startOfYear(now);

    const filtered = sales.filter(s => new Date(s.created_date) >= startDate && s.status !== 'cancelled');
    const filteredExpenses = expenses.filter(e => new Date(e.created_date) >= startDate);

    const revenue = filtered.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const costOfGoods = filtered.reduce((sum, s) => sum + (s.total_cost || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const grossProfit = revenue - costOfGoods;
    const netProfit = grossProfit - totalExpenses;

    // Delivery vs walk-in
    const walkInSales = filtered.filter(s => s.order_type !== 'delivery');
    const deliverySales = filtered.filter(s => s.order_type === 'delivery');
    const walkInRevenue = walkInSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const deliveryRevenue = deliverySales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const deliveryFees = deliverySales.reduce((sum, s) => sum + (s.delivery_fee || 0), 0);
    const deliveryPct = filtered.length > 0 ? Math.round((deliverySales.length / filtered.length) * 100) : 0;

    // Payment method breakdown
    const mpesaSales = filtered.filter(s => s.payment_method === 'mpesa_stk' || s.payment_method === 'mpesa');
    const cashSales = filtered.filter(s => s.payment_method === 'cash');
    const mpesaRevenue = mpesaSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const cashRevenue = cashSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const pendingPayments = filtered.filter(s => s.payment_status === 'pending' || s.payment_status === 'unpaid').length;

    return {
      revenue, totalExpenses, grossProfit, netProfit, totalSales: filtered.length,
      walkInRevenue, deliveryRevenue, deliveryFees, deliveryPct,
      mpesaRevenue, cashRevenue, pendingPayments,
    };
  }, [sales, expenses, period]);

  const chartData = useMemo(() => {
    const days = period === 'day' ? 24 : period === 'week' ? 7 : period === 'month' ? 30 : 12;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const label = period === 'year' ? format(date, 'MMM') : period === 'day' ? format(date, 'HH:00') : format(date, 'MMM d');
      const daySales = sales.filter(s => {
        const sd = new Date(s.created_date);
        return format(sd, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && s.status !== 'cancelled';
      });
      data.push({ name: label, sales: daySales.reduce((sum, s) => sum + (s.total_amount || 0), 0) });
    }
    return data;
  }, [sales, period]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`KES ${stats.revenue.toLocaleString()}`} icon={DollarSign} color="green" trend="up" trendValue={`${stats.totalSales} sales`} />
        <StatCard title="Expenses" value={`KES ${stats.totalExpenses.toLocaleString()}`} icon={TrendingDown} color="red" />
        <StatCard title="Gross Profit" value={`KES ${stats.grossProfit.toLocaleString()}`} icon={TrendingUp} color="blue" />
        <StatCard title="Net Profit" value={`KES ${stats.netProfit.toLocaleString()}`} icon={DollarSign} color={stats.netProfit >= 0 ? 'green' : 'red'} />
      </div>

      {/* Delivery & Payment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Walk-In Sales" value={`KES ${stats.walkInRevenue.toLocaleString()}`} icon={User} color="primary" />
        <StatCard title="Delivery Sales" value={`KES ${stats.deliveryRevenue.toLocaleString()}`} icon={Truck} color="blue" trendValue={`${stats.deliveryPct}% of sales`} trend="up" />
        <StatCard title="Delivery Fees" value={`KES ${stats.deliveryFees.toLocaleString()}`} icon={Truck} color="orange" />
        <StatCard title="M-PESA Sales" value={`KES ${stats.mpesaRevenue.toLocaleString()}`} icon={Smartphone} color="green" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart data={chartData} />
        </div>
        <TopProducts sales={sales} />
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RecentSales sales={sales} />
        <LowStockAlert products={products} />
      </div>
    </div>
  );
}
