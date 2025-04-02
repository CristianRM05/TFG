import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { User } from './auth';

export interface Product {
    id: number;
    name: string;
    num_reference: string;
    description?: string;
    price?: number;
    weight?: number;
    volume?: number;
    image_url?: string;
    shelf_id?: number;
    created_at?: string;
    updated_at?: string;
    shelf?: Shelf; // Añade esta línea

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


export interface ShelvesPageProps extends SharedData {
    shelves: Shelf[];
    unassignedProducts: Product[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export interface Stock {
    id: number;
    product_id: number;
    available_quantity: number;
    shelf_id?: number;
    created_at: string;
    updated_at: string;
    shelf?: Shelf; 
}


export interface SharedData {
    auth: {
        user?: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

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
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
