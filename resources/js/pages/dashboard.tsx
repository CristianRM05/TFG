import {  router } from '@inertiajs/react';
// resources/js/pages/dashboard.tsx

import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import ProductList from './product/productList';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth.user;

    if (!auth?.user) {
        return <div className="p-6 text-center text-gray-500">Cargando datos del usuario...</div>;
    }
    if (auth.user) {
        const role = auth.user.role?.toString().toLowerCase() || '';
        if (role === 'admin') {
            router.visit('/admin/dashboard');
        } else if (role === 'manager') {
            router.visit('/manager/dashboard');
        } else {
        }
    }

  if (!auth?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <span className="text-gray-500 dark:text-gray-400">Cargando datos del usuario…</span>
      </div>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel de trabajador" />

      {/* Hero */}
      <section className="bg-black/70 text-white text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-2">
          Bienvenido, {auth.user.name}
        </h1>
        <p className="text-lg md:text-2xl">
          Explora y gestiona tus productos
        </p>
      </section>

      {/* Contenedor con fondo claro para el listado */}
      <div className="w-full px-4 md:px-8 py-12  ">
        <ProductList />
      </div>
    </AppLayout>
  );
}
