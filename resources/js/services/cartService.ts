// cartService.ts: todas las peticiones relacionadas al carrito

import axios from 'axios';

export const updateCartQuantity = async (id: number, quantity: number) => {
    return await axios.put(route('cart.updateQuantity', id), {
        quantity
    });
};
export const deleteProduct = async (id: number) => {
    try {
        await axios.delete(
            `/cart/remove/${id}`,
            {
                withCredentials: true,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            }
        );
        console.log('✅ Producto eliminado del carrito correctamente');
    } catch (error) {
        console.error('❌ Error al eliminar el producto del carrito:', error);
    }
};

export const applyCouponToCart = async (couponCode: string) => {
    return await axios.post('http://localhost:8001/apply-coupon', {
        code: couponCode
    }, {
        withCredentials: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
    });
};

export const proceedToCheckout = async (discount: number) => {
    return await axios.post(route('checkout'), {
        discount
    }, {
        withCredentials: true
    });
};
