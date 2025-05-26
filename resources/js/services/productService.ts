
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
      limit: 6, // sigue siendo 6 por página
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
export const addToCart = async (productId: number) => {
    try {
        await axios.post(
            `/cart/add/${productId}`,
            { quantity: 1 },
            {
                withCredentials: true,
              headers: {
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-TOKEN': Cookies.get('XSRF-TOKEN') || '',
}
            }
        );
        console.log('✅ Producto añadido al carrito correctamente');
    } catch (error) {
        console.error('❌ Error al añadir el producto al carrito:', error);
    }
};
