import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app/app-header-layout';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Tooltip,
} from 'recharts';

type ProductStat = {
  product: { id: number; name: string };
  total_qty: number;
};

type MonthlyRev = {
  month: string;
  revenue: number;
};

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

  return (
    <AppLayout
      user={auth.user}
      breadcrumbs={[{ title: 'Movimientos', href: route('manager.movimientos.index') }]}
      header="Panel de Movimientos"
      className="bg-white/10 dark:bg-black/50"
    >
      <Head title="Movimientos" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* INGRESOS DEL MES */}
        <div className="bg-white/20 dark:bg-gray-800 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Ingresos este mes</h2>
          <p className="text-4xl font-bold text-amber-500">
            ${revenueNumber.toFixed(2)}
          </p>
        </div>

        {/* GRÁFICA DE INGRESOS POR MES */}
        <div className="bg-white/20 dark:bg-gray-800 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Ingresos últimos meses</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(val: any) => `$${val}`} />
              <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP PRODUCTOS */}
        <div className="bg-white/20 dark:bg-gray-800 p-6 rounded-2xl backdrop-blur-md shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Top Productos Vendidos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product.name" />
              <YAxis />
              <Tooltip formatter={(val: any) => `${val} uds`} />
              <Bar dataKey="total_qty" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA DETALLADA */}
      <div className="mt-8 bg-white/20 dark:bg-gray-800 p-6 rounded-2xl backdrop-blur-md shadow-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Tabla de Ventas Detallada</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-right">Unidades Vendidas</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((row, i) => (
              <tr key={row.product.id} className={i % 2 ? 'bg-white/10' : ''}>
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
