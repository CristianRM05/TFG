// cartService.ts
import { router } from '@inertiajs/react';
import axios from 'axios';

export const updateCartQuantity = async (id: number, quantity: number) => {
    try {
        const response = await axios.put(route('cart.updateQuantity', id), {
            quantity,
        });

        window.dispatchEvent(new CustomEvent('cart:updated', {
            detail: { count: response.data.cartItemCount }
        }));

        console.log('✅ Cantidad actualizada correctamente.');
        return response;
    } catch (error) {
        console.error('❌ Error al actualizar la cantidad del producto:', error);
        throw error;
    }
};

export const deleteProduct = async (cartItemId: number) => {
    try {
        const response = await axios.delete(`/cart/remove/${cartItemId}`);

        window.dispatchEvent(new CustomEvent('cart:updated', {
            detail: { count: response.data.cartItemCount }
        }));

        console.log('✅ Producto eliminado del carrito.');
    } catch (error) {
        console.error('❌ Error al eliminar el producto del carrito:', error);
    }
};



export const applyCouponToCart = async (couponCode: string) => {
  try {
    const response = await axios.post('/apply-coupon', {
      code: couponCode,
    });

    return response.data; 
  } catch (error: any) {
    throw error;
  }
};



export const proceedToCheckout = async (discount: number) => {
    return await axios.post(route('checkout'), {
        discount
    });
};
