import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app/app-header-layout';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';

// Tipado
interface ProductStat {
  product: { id: number; name: string };
  total_qty: number;
}

interface MonthlyRev {
  month: string;
  revenue: number;
}

interface Props {
  topProducts: ProductStat[];
  monthlyRevenue: MonthlyRev[];
  thisMonthRevenue: number | string;
  auth: { user: { name: string } };
  [key: string]: any;
}

export default function Movimientos() {
  const { topProducts, monthlyRevenue, thisMonthRevenue, auth } =
    usePage<Props>().props;

  const revenueNumber = Number(thisMonthRevenue) || 0;

  // Verificaciones para desarrollo/debug
  useEffect(() => {


    if (!Array.isArray(monthlyRevenue) || monthlyRevenue.length === 0) {
      console.warn("⚠️ No hay datos de ingresos mensuales para mostrar en la gráfica.");
    }

    if (!Array.isArray(topProducts) || topProducts.length === 0) {
      console.warn("⚠️ No hay datos de productos más vendidos para mostrar.");
    }
  }, [topProducts, monthlyRevenue, thisMonthRevenue]);

  return (
    <AppLayout
      user={auth.user}
      breadcrumbs={[{ title: 'Movimientos', href: route('manager.movimientos.index') }]}
      header="📊 Panel de Movimientos"
      className="bg-gradient-to-br from-sky-50 to-white dark:from-black dark:to-gray-900"
    >
      <Head title="Movimientos" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* INGRESOS DEL MES */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            Ingresos este mes <ArrowUpRight className="text-green-500" size={20} />
          </h2>
          <p className="text-5xl font-extrabold text-emerald-500 tracking-tight">
            € {revenueNumber.toFixed(2)}
          </p>
        </div>

        {/* GRÁFICA DE INGRESOS */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Ingresos últimos meses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <CartesianGrid strokeDasharray="4 4" />
              <Tooltip formatter={(val: any) => `€${val}`} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* TOP PRODUCTOS */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Top Productos Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis className='dark:text-black' dataKey="product.name" tick={false} axisLine={false} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(val: any) => `${val} uds`} />
              <Legend />
              <Bar dataKey="total_qty" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA DETALLADA */}
      <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Tabla de Ventas Detallada</h2>
        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-right">Unidades Vendidas</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((row, i) => (
              <tr key={row.product.id} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/40' : ''}>
                <td className="px-4 py-2">{row.product.name}</td>
                <td className="px-4 py-2 text-right">{row.total_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
