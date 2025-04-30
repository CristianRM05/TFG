import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PaginaBebidas() {
    const { auth } = usePage<{ auth: { user?: { name: string } } }>().props;
    const [modalNewsletter, setModalNewsletter] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [email, setEmail] = useState('');

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleSubscribe = async () => {
        try {
            await axios.post('/api/subscribe', { email });
            Swal.fire('¡Listo!', 'Te has suscrito con éxito 🎉', 'success');
            setEmail('');
            setModalNewsletter(false);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Hubo un error al suscribirte';
            Swal.fire('Error', message, 'error');
        }
    };

    const categoriasBebidas = [
        {
            nombre: 'Bebidas Alcohólicas',
            descripcion: 'Licores premium, cervezas artesanales y vinos selectos',
            icono: '🍸',
            color: isDarkMode ? 'bg-yellow-900/20' : 'bg-amber-100',
            productos: [
                {
                    nombre: 'Colección de Whiskies Añejos',
                    precio: '49.990 CLP',
                    imagen: '/whisky-coleccion.jpg',
                    descripcion: 'Selección de whiskies de las mejores destilerías'
                },
                {
                    nombre: 'Pack Cervezas Artesanales',
                    precio: '25.000 CLP',
                    imagen: '/cervezas-artesanales.jpg',
                    descripcion: 'Las mejores cervezas craft de la región'
                },
                {
                    nombre: 'Vinos Reserva Especial',
                    precio: '39.990 CLP',
                    imagen: '/vinos-reserva.jpg',
                    descripcion: 'Vinos seleccionados de viñedos premium'
                }
            ]
        },
        {
            nombre: 'Bebidas Sin Alcohol',
            descripcion: 'Refrescantes jugos, sodas y bebidas especiales',
            icono: '🥤',
            color: isDarkMode ? 'bg-lime-900/20' : 'bg-lime-100',
            productos: [
                {
                    nombre: 'Pack de Smoothies Orgánicos',
                    precio: '15.000 CLP',
                    imagen: '/smoothies.jpg',
                    descripcion: 'Smoothies 100% naturales y saludables'
                },
                {
                    nombre: 'Aguas Saborizadas Gourmet',
                    precio: '10.000 CLP',
                    imagen: '/aguas-saborizadas.jpg',
                    descripcion: 'Hidratación con sabores únicos'
                },
                {
                    nombre: 'Té Frío Artesanal',
                    precio: '8.000 CLP',
                    imagen: '/te-frio.jpg',
                    descripcion: 'Refrescantes variedades de té'
                }
            ]
        }
    ];

    const beneficios = [
        {
            icono: '🚚',
            titulo: 'Envío Gratis',
            descripcion: 'En compras sobre > 1200€'
        },
        {
            icono: '🍷',
            titulo: 'Asesoría de Expertos',
            descripcion: 'Recomendaciones personalizadas'
        },
        {
            icono: '🏆',
            titulo: 'Calidad Garantizada',
            descripcion: 'Productos seleccionados'
        }
    ];

    const testimonios = [
        {
            nombre: 'María Fernández',
            comentario: 'La mejor selección de bebidas que he encontrado. ¡Increíble variedad!',
            avatar: '/avatar-maria.jpg'
        },
        {
            nombre: 'Carlos Mendoza',
            comentario: 'Servicio impecable y productos de primera calidad.',
            avatar: '/avatar-carlos.jpg'
        }
    ];

    return (
        <div className={`
            min-h-screen relative
            ${isDarkMode
                ? 'bg-gradient-to-br from-stone-900 to-stone-800 text-gray-100'
                : 'bg-gradient-to-br from-amber-50 to-yellow-100 text-gray-800'
            }
        `}>
            {/* Botón de modo claro/oscuro */}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={toggleDarkMode}
                    className={`
                        p-3 rounded-full shadow-lg
                        ${isDarkMode
                            ? 'bg-stone-700 text-yellow-400'
                            : 'bg-yellow-200 text-stone-800'}
                    `}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Botón de Newsletter fijo */}
            <div className="fixed bottom-20 right-4 z-50">
                <button
                    onClick={() => setModalNewsletter(true)}
                    className="bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-orange-700 transition"
                >
                    📩 ¡No perderse nada!
                </button>
            </div>

            {/* Navegación */}
            <nav className={`
                sticky top-0 z-40
                ${isDarkMode
                    ? 'bg-stone-800/90 border-b border-stone-700'
                    : 'bg-white/90 shadow-md'}
            `}>
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold text-amber-700">🍹 BebidasPro</span>
                    </div>
                    <div className="space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className={`
                                    px-4 py-2 rounded-full
                                    ${isDarkMode
                                        ? 'bg-yellow-800 text-white hover:bg-yellow-700'
                                        : 'bg-yellow-500 text-white hover:bg-yellow-600'}
                                `}
                            >
                                Panel de Control
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className={`
                                        px-4 py-2 rounded-full
                                        ${isDarkMode
                                            ? 'text-yellow-300 hover:bg-stone-700'
                                            : 'text-yellow-700 hover:bg-yellow-100'}
                                    `}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className={`
                                        px-4 py-2 rounded-full
                                        ${isDarkMode
                                            ? 'bg-yellow-800 text-white hover:bg-yellow-700'
                                            : 'bg-yellow-500 text-white hover:bg-yellow-600'}
                                    `}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sección Hero */}
            <header className="container mx-auto px-4 py-16 grid md:grid-cols-2 items-center">
                <div>
                    <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-amber-800'}`}>
                        Descubre el Mundo de las
                        <br />
                        <span className="text-orange-700">Mejores Bebidas</span>
                    </h1>
                    <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                        Selección premium de bebidas para cada momento y ocasión
                    </p>
                    <div className="space-x-4">
                        <Link
                            href={route('dashboard')}
                            className={`
                                inline-block px-6 py-3 rounded-full
                                ${isDarkMode
                                    ? 'bg-amber-800 text-white hover:bg-amber-700'
                                    : 'bg-amber-600 text-white hover:bg-amber-700'}
                            `}
                        >
                            Ver Catálogo
                        </Link>
                    </div>
                </div>
                <div className="hidden md:block">
                    <img
                        src="https://gestoriapastor.org/wp-content/uploads/2021/01/the-refrescos.jpg"
                        alt="Colección de Bebidas"
                        className="w-full rounded-xl shadow-2xl"
                    />
                </div>
            </header>

            {/* Sección Beneficios */}
            <section className={`container mx-auto px-4 py-16 ${isDarkMode ? 'bg-stone-800/50' : 'bg-amber-100/60'}`}>
                <div className="grid md:grid-cols-3 gap-8">
                    {beneficios.map((beneficio, index) => (
                        <div
                            key={index}
                            className={`text-center p-6 rounded-xl hover:shadow-lg transition-all ${isDarkMode ? 'bg-stone-700/80' : 'bg-white/80'}`}
                        >
                            <div className="text-5xl mb-4">{beneficio.icono}</div>
                            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-stone-800'}`}>
                                {beneficio.titulo}
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                                {beneficio.descripcion}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sección Testimonios */}
            <section className={`container mx-auto px-4 py-16 ${isDarkMode ? 'bg-stone-800/50' : 'bg-amber-100/60'}`}>
                <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-gray-100' : 'text-stone-800'}`}>
                    Lo Que Dicen Nuestros Clientes
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonios.map((testimonio, index) => (
                        <div
                            key={index}
                            className={`rounded-xl p-6 shadow-lg ${isDarkMode ? 'bg-stone-700/80 text-gray-100' : 'bg-white/80 text-stone-800'}`}
                        >
                            <div className="flex items-center mb-4">
                                <div>
                                    <h3 className="font-semibold">{testimonio.nombre}</h3>
                                </div>
                            </div>
                            <p className={`italic ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                                "{testimonio.comentario}"
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal Newsletter */}
            {modalNewsletter && (
                <div className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
                    <div className={`p-8 rounded-xl max-w-md w-full ${isDarkMode ? 'bg-stone-700 text-gray-100' : 'bg-white text-stone-800'}`}>
                        <h2 className="text-2xl font-bold mb-4 text-center">¡Suscríbete y Recibe Ofertas!</h2>
                        <p className="text-center mb-6">Recibe las mejores promociones en tu correo</p>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`
                                w-full px-4 py-2 rounded-full mb-4
                                ${isDarkMode
                                    ? 'bg-stone-600 text-gray-100 placeholder-gray-400'
                                    : 'bg-stone-100 text-stone-800'}
                            `}
                        />
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700"
                                onClick={handleSubscribe}
                            >
                                Suscribirme
                            </button>
                            <button
                                className="bg-stone-300 text-stone-700 px-6 py-2 rounded-full hover:bg-stone-400"
                                onClick={() => setModalNewsletter(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
