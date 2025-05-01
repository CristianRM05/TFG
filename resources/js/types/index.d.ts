import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

interface User {
    id: number;
    name: string;
    last_name: string;
    email: string;
    dni: string;
    phone: string;
    address: string;
    role: string;
    photograph: string | null;
    license?: string;
    driver_license?: string;
    license_expiration_date?: string;
    created_at: string;
    updated_at: string;
    banned_at: string | null;

}

interface Product {
    id: number;
    name: string;
    num_reference: string;
    price?: number;
    discount_percent?: number | null;
    final_price?: number;
    image_url?: string;
    stock: number;
    location: string;
    max_capacity?: number;
}

interface Props {
    products: Product[];
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}

interface Stock {
    available_quantity: number;
    location: string;
    shelf?: {
        max_capacity?: number;
    };
}

interface StockProduct {
    id: number;
    name: string;
    num_reference: string;
    price?: number;
    image_url?: string;
    stocks: Stock[];
}

export interface Shelf {
    id: number;
    code: string;
    location: string;
    max_capacity: number;
    created_at?: string;
    updated_at?: string;
    total_stock?: number;
    products_count?: number;
    products?: Product[];
}

interface Props {
    products: StockProduct[];
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}