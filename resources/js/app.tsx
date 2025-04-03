import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// resources/js/types/stock.d.ts
export interface Shelf {
    id: number;
    code: string;
    location: string;
    max_capacity: number;
    created_at: string;
    updated_at: string;
}

export interface Stock {
    id: number;
    product_id: number;
    available_quantity: number;
    location: string;
    created_at: string;
    updated_at: string;
    shelf?: Shelf;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    num_reference: string;
    weight: number;
    volume: number;
    price: number;
    image_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface StockProduct extends Product {
    stocks: Stock[];
}
// This will set light / dark mode on load...
initializeTheme();
