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
            const message = error.response?.data?.message || 'Error al procesar el pago.';
            MySwal.fire({
                icon: 'error',
                title: 'Error',
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
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Head title="Mi Carrito" />

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Carrito */}
                    <div className="md:col-span-2">
                        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                            <ShoppingBag className="text-blue-600" size={36} />
                            Mi Carrito
                        </h1>

                        {success && (
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 flex items-center text-green-700">
                                <CheckCircle className="mr-3 text-green-500" />
                                <span className="font-medium">{success}</span>
                            </div>
                        )}

                        {cart.items.length > 0 ? (
                            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                    {cart.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                            <div className="flex-grow">
                                                <h2 className="font-semibold text-lg text-gray-800">{item.product.name}</h2>
                                                <div className="text-gray-600 mt-1 flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        Cantidad:
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-gray-200 rounded">-</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-gray-200 rounded">+</button>
                                                    </span>
                                                    <span>Precio: {formatPrice(item.price)} €</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="font-bold text-blue-600">
                                                    {formatPrice(item.price * item.quantity)} €
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center bg-gray-50 p-8 rounded-xl">
                                <ShoppingBag size={60} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-xl text-gray-600">Tu carrito está vacío</p>
                                <Link
                                    href="/productos"
                                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                                >
                                    Explorar Productos
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Resumen */}
                    <div>
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <ShieldCheck className="mr-3 text-blue-600" size={28} />
                                Resumen del Pedido
                            </h2>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                                    <Tag className="mr-2 text-blue-600" size={20} />
                                    Cupón de Descuento
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Introduce tu cupón"
                                        className="flex-grow p-2 border rounded-l-lg"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                                    >
                                        Aplicar
                                    </button>
                                </div>

                                {appliedCoupon && (
                                    <div className="mt-2 bg-green-50 p-2 rounded flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Percent className="mr-2 text-green-600" size={16} />
                                            <span className="text-green-700">
                                                Cupón {appliedCoupon.code}: {appliedCoupon.discountPercentage}% de descuento
                                            </span>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-red-500 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">{formatPrice(calculateSubtotal())} €</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Descuento ({appliedCoupon.discountPercentage}%)</span>
                                        <span>
                                            -{formatPrice(calculateSubtotal() * (appliedCoupon.discountPercentage / 100))} €
                                        </span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-blue-600">{calculateTotal()} €</span>
                                </div>
                            </div>

                            <button
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                                onClick={handleCheckout}
                            >
                                <ShoppingBag className="mr-2" size={20} />
                                Proceder al Pago
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
