export interface Product {
    id: number;
    name: string;
    description: string;
    num_reference: string;
    weight: number;
    discount_percent: number;
    final_price: number;
    volume: number;
    price: number;
    created_at?: string;
    updated_at?: string;
    image_url?: string;
    categoria?: string;
    stock?: number;
    is_visible: boolean;
}
