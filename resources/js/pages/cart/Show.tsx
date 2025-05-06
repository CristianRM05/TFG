import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    Trash2,
    ShoppingBag,
    CheckCircle,
    Tag,
    Percent,
    ShieldCheck
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { updateCartQuantity, applyCouponToCart, proceedToCheckout, deleteProduct } from '@/services/cartService';

const MySwal = withReactContent(Swal);

export default function CartShow({ cart: initialCart, success }: { cart: any, success: string }) {
    const [cart, setCart] = useState(initialCart);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercentage: number } | null>(null);

    const formatPrice = (price: number) => {
        const numPrice = Number(price);
        return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
    };

    const calculateSubtotal = () => {
        return cart ? cart.items.reduce((total: number, item: any) => {
            const itemPrice = Number(item.price);
            const itemQuantity = Number(item.quantity);
            return total + (!isNaN(itemPrice) && !isNaN(itemQuantity)
                ? itemPrice * itemQuantity
                : 0);
        }, 0) : 0;
    };

    const calculateTotal = () => {
        let subtotal = calculateSubtotal();

        if (appliedCoupon) {
            subtotal *= (1 - appliedCoupon.discountPercentage / 100);
        }

        return subtotal.toFixed(2);
    };

    const handleCheckout = async () => {
        try {
          const discount = appliedCoupon?.discountPercentage ?? 0;

          const response = await proceedToCheckout(discount);

          window.location.href = response.data.url;

        } catch (error: any) {
          const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Error al procesar el pago.';

          MySwal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            text: message,
          });
        }
      };



    const removeItem = (id: number) => {
        MySwal.fire({
            title: '¿Estás segura?',
            text: 'Este producto se eliminará del carrito.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct(id);

                    const updatedItems = cart.items.filter((item: any) => item.id !== id);
                    setCart({ ...cart, items: updatedItems });

                    MySwal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Producto eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } catch (error) {
                    console.error(error);
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el producto del carrito.',
                    });
                }
            }
        });
    };

    const updateQuantity = async (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            await updateCartQuantity(id, newQuantity);

            const updatedItems = cart.items.map((item: any) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );

            setCart({ ...cart, items: updatedItems });

            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Cantidad actualizada',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la cantidad.',
            });
        }
    };

    const applyCoupon = async () => {
        try {
            const response = await applyCouponToCart(couponCode);
            const discount = response.data.discount;

            setAppliedCoupon({ code: couponCode, discountPercentage: discount });

            MySwal.fire({
                icon: 'success',
                title: 'Cupón aplicado',
                text: `Se ha aplicado un descuento del ${discount}%`,
            });
        } catch (error:any) {
            const message = error.response?.data?.message || 'El cupón no se pudo aplicar.';
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    return (
        <AppLayout>
        <Head title="Mi Carrito" />

        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-12 px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Éxito */}
            {success && (
              <div className="fixed top-4 inset-x-0 flex justify-center z-50">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  {success}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ítems del carrito */}
              <div className="md:col-span-2 space-y-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <ShoppingBag className="text-amber-600" size={36} />
                  Mi Carrito
                </h1>

                {cart.items.length > 0 ? (
                  <div className="space-y-4">
                    {cart.items.map(item => (
                      <div
                        key={item.id}
                        className="bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:shadow-xl transition"
                      >
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold">{item.product.name}</h2>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              Cantidad:
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="px-2 bg-white/20 dark:bg-gray-700 rounded-full"
                              >
                                –
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-2 bg-white/20 dark:bg-gray-700 rounded-full"
                              >
                                +
                              </button>
                            </span>
                            <span>Precio: {formatPrice(item.price)} €</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-amber-500">
                            {formatPrice(item.price * item.quantity)} €
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 bg-white/20 dark:bg-gray-700 rounded-full hover:bg-red-600 hover:text-white transition"
                            title="Eliminar producto"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center shadow-lg">
                    <ShoppingBag size={60} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-xl">Tu carrito está vacío</p>
                    <Link
                      href="/productos"
                      className="mt-4 inline-block bg-amber-600 text-black font-semibold px-6 py-2 rounded-full hover:bg-amber-500 transition"
                    >
                      Explorar Productos
                    </Link>
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="space-y-6">
                <div className="bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold flex items-center mb-6">
                    <ShieldCheck className="mr-3 text-amber-600" size={28} />
                    Resumen del Pedido
                  </h2>

                  {/* Cupón */}
                  <div className="space-y-4">
                    <label className="flex items-center text-sm font-medium">
                      <Tag className="mr-2 text-amber-600" size={20} />
                      Cupón de Descuento
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="Introduce tu cupón"
                        className="flex-grow bg-white/20 dark:bg-gray-700 border border-white/30 dark:border-gray-600 rounded-l-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-amber-400 focus:border-amber-400"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-amber-600 text-black px-4 py-2 rounded-r-lg hover:bg-amber-500 transition"
                      >
                        Aplicar
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="bg-green-700 bg-opacity-30 text-green-100 px-4 py-2 rounded-full flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <Percent size={16} />
                          Cupón {appliedCoupon.code}: {appliedCoupon.discountPercentage}%
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Totales */}
                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())} €</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Descuento ({appliedCoupon.discountPercentage}%)</span>
                        <span>
                          -{formatPrice(
                            calculateSubtotal() *
                              (appliedCoupon.discountPercentage / 100)
                          )}{' '}
                          €
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-amber-500">{calculateTotal()} €</span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-amber-600 text-black py-3 rounded-full font-semibold uppercase flex items-center justify-center hover:bg-amber-500 transition"
                  >
                    <ShoppingBag className="mr-2" size={20} />
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>

    );
}
