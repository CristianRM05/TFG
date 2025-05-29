
// services/productService.ts
import axios from 'axios';
import Cookies from 'js-cookie';

export const getProducts = async (
    page = 1,
    search = '',
    category = '',
    minPrice = '',
    maxPrice = ''
) => {
    const response = await axios.get('/products', {
        params: {
            page,
            limit: 6, 
            search,
            category,
            min_price: minPrice,
            max_price: maxPrice,
        },
    });

    return response.data;
};
export const getCategories = async () => {
    const response = await axios.get('/products/categories');
    return response.data; // array con value y name
};
export const addToCart = async (productId: number, quantity: number = 1) => {
    try {
        const response = await axios.post(`/cart/add/${productId}`, { quantity });

        const newCount = response.data.cartItemCount;

        window.dispatchEvent(new CustomEvent('cart:updated', {
            detail: { count: newCount }
        }));

    } catch (error) {
        console.error("❌ Error al agregar al carrito:", error);
    }
};


