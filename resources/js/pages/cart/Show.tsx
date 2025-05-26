import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Trash2,
  ShoppingBag,
  Tag,
  Percent,
  ShieldCheck
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import {
  updateCartQuantity,
  applyCouponToCart,
  proceedToCheckout,
  deleteProduct
} from '@/services/cartService';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MySwal = withReactContent(Swal);

export default function CartShow({
  cart: initialCart,
  success
}: {
  cart: any;
  success: string;
}) {
  const [cart, setCart] = useState(initialCart);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
  } | null>(null);

  const formatPrice = (price: number) => {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const calculateSubtotal = () =>
    cart
      ? cart.items.reduce(
          (sum: number, item: any) =>
            sum + (isNaN(item.price) || isNaN(item.quantity)
              ? 0
              : item.price * item.quantity),
          0
        )
      : 0;

  const calculateTotal = () => {
    let sub = calculateSubtotal();
    if (appliedCoupon) sub *= 1 - appliedCoupon.discountPercentage / 100;
    return sub.toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      const discount = appliedCoupon?.discountPercentage ?? 0;
      const res = await proceedToCheckout(discount);
      window.location.href = res.data.url;
    } catch (e: any) {
      MySwal.fire('Error', e.response?.data?.message || 'Pago fallido. Revisa tu dirección', 'error');
    }
  };

  const removeItem = (id: number) => {
    MySwal.fire({
      title: '¿Eliminar?',
      text: 'Se quitará este artículo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(async (r) => {
      if (r.isConfirmed) {
        await deleteProduct(id);
        setCart({
          ...cart,
          items: cart.items.filter((i: any) => i.id !== id)
        });
        toast.success('Producto eliminado', {
          icon: '🗑️',
          style: {
            borderRadius: '10px',
            background: '#dc2626',
            color: '#fff',
          },
          duration: 1500,
        });
      }
    });
  };

  const updateQuantity = async (id: number, qty: number) => {
    if (qty < 1) return;
    await updateCartQuantity(id, qty);
    setCart({
      ...cart,
      items: cart.items.map((i: any) =>
        i.id === id ? { ...i, quantity: qty } : i
      )
    });
    toast.success(`Cantidad actualizada: ${qty}`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#d97706',
        color: '#fff',
      },
      duration: 1500,
    });
  };

const applyCoupon = async () => {
  try {
    const res = await applyCouponToCart(couponCode);
    setAppliedCoupon({
      code: couponCode,
      discountPercentage: res.discount 
    });

    toast.success('¡Cupón aplicado!', {
      icon: '🎟️',
      style: {
        borderRadius: '10px',
        background: '#16a34a',
        color: '#fff',
      },
      duration: 1500,
    });
  } catch {
    toast.error('Cupón inválido', {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#dc2626',
        color: '#fff',
      },
      duration: 1500,
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
      <Toaster position="top-right" />

      <div className="min-h-screen  text-gray-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {success && (
            <div className="fixed top-4 inset-x-0 flex justify-center z-50">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                {success}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 [@media(min-width:1200px)]:grid-cols-3">

            <div className="space-y-6 [@media(min-width:1100px)]:col-span-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingBag className="text-amber-600" size={36} />
                Mi Carrito
              </h1>

              {cart.items.length > 0 ? (
                cart.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg transition hover:shadow-xl"
                  >
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{item.product.name}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          Cantidad:
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 bg-white/20 dark:bg-gray-700 rounded-full"
                          >
                            –
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 bg-white/20 dark:bg-gray-700 rounded-full"
                          >
                            +
                          </button>
                        </span>
                        <span>Precio: {formatPrice(item.price)} €</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
                      <span className="font-bold text-amber-500">
                        {formatPrice(item.price * item.quantity)} €
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 bg-white/40 dark:bg-gray-700 rounded-full hover:bg-red-100 hover:text-white transition"
                        title="Eliminar"
                      >
                        <Trash2 color='red' size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center shadow-lg">
                  <ShoppingBag size={60} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-xl">Tu carrito está vacío</p>
                  <Link
                    href="/dashboard"
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
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Introduce tu cupón"
                      className="w-full bg-white/20 dark:bg-gray-700 border border-white/30 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-amber-400 focus:border-amber-400"
                    />
                    <button
                      onClick={applyCoupon}
                      className="w-full sm:w-auto bg-amber-600 text-black px-4 py-2 rounded-lg hover:bg-amber-500 transition flex-shrink-0"
                    >
                      Aplicar
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="bg-green-700 bg-opacity-30 text-green-100 px-4 py-2 rounded-full flex flex-col sm:flex-row justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Percent size={16} />
                        Cupón {appliedCoupon.code}: {appliedCoupon.discountPercentage}%
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="mt-2 sm:mt-0 text-red-500 hover:text-red-300"
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
                    <span>{formatPrice(calculateSubtotal())} €</span>
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
                    <span className="text-amber-500">{calculateTotal()} €</span>
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
