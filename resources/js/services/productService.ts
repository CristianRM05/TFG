import axios from 'axios';

export const getProducts = async (page = 1) => {
  const response = await axios.get(`/products?page=${page}`);
  return response.data;
};
export const addToCart = async (productId: number) => {
    try {
        await axios.post(
            `/cart/add/${productId}`,
            { quantity: 1 },
            {
                withCredentials: true,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            }
        );
        console.log('✅ Producto añadido al carrito correctamente');
    } catch (error) {
        console.error('❌ Error al añadir el producto al carrito:', error);
    }
};