// cartService.ts
import { router } from '@inertiajs/react';
import axios from 'axios';

export const updateCartQuantity = async (id: number, quantity: number) => {
    return await axios.put(route('cart.updateQuantity', id), {
        quantity
    });
};

export const deleteProduct = async (id: number) => {
    try {
        await axios.delete(`/cart/remove/${id}`);
        console.log('✅ Producto eliminado del carrito correctamente');
    } catch (error) {
        console.error('❌ Error al eliminar el producto del carrito:', error);
    }
};

export const applyCouponToCart = async (couponCode: string) => {
  try {
    const response = await axios.post('/apply-coupon', {
      code: couponCode,
    });

    return response.data; // ✅ este es el objeto que llega como `res`
  } catch (error: any) {
    throw error;
  }
};



export const proceedToCheckout = async (discount: number) => {
    return await axios.post(route('checkout'), {
        discount
    });
};
