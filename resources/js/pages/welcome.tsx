// resources/js/Pages/PaginaBebidas.tsx
import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CreateTicketModal from './Tickets/CreateTicket';

export default function PaginaBebidas() {
    const { auth } = usePage<{ auth: { user?: { name: string } } }>().props;
    const [modalNewsletter, setModalNewsletter] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false)

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const handleSubscribe = async () => {
        try {
            await axios.post('/subscribe', { email });
            Swal.fire('¡Listo!', 'Te has suscrito con éxito 🎉', 'success');
            setEmail('');
            setModalNewsletter(false);
        } catch (e: any) {
            Swal.fire('Error', e.response?.data?.message ?? 'Algo salió mal', 'error');
        }
    };

    const categoriasBebidas = [
        {
            nombre: 'Bebidas Alcohólicas',
            descripcion: 'Licores premium, cervezas y vinos selectos',
            icono: '/images/icon-alcohol.svg',
            productos: [
                { nombre: 'Whisky Añejo', precio: '49.990 CLP', imagen: '/images/whisky.png' },
                { nombre: 'Cervezas Artesanales', precio: '25.000 CLP', imagen: '/images/cerveza.png' },
                { nombre: 'Vino Reserva', precio: '39.990 CLP', imagen: '/images/vino.png' },
            ],
        },
        {
            nombre: 'Bebidas Sin Alcohol',
            descripcion: 'Jugos naturales, sodas y smoothies',
            icono: '/images/icon-nalcohol.svg',
            productos: [
                { nombre: 'Smoothies Orgánicos', precio: '15.000 CLP', imagen: '/images/smoothie.png' },
                { nombre: 'Aguas Saborizadas', precio: '10.000 CLP', imagen: '/images/agua.png' },
                { nombre: 'Té Frío Artesanal', precio: '8.000 CLP', imagen: '/images/te.png' },
            ],
        },
    ];

    const beneficios = [
        { icono: '🚚', titulo: 'Envío Gratis', descripcion: 'En compras sobre 1200€' },
        { icono: '🍷', titulo: 'Asesoría', descripcion: 'Recomendaciones de expertos' },
        { icono: '🏆', titulo: 'Calidad', descripcion: 'Productos seleccionados' },
    ];

    const testimonios = [
        {
            nombre: 'María Fernández',
            comentario: 'La mejor selección de bebidas que he encontrado. ¡Increíble variedad!',
            avatar: '/images/avatar-maria.jpg',
        },
        {
            nombre: 'Carlos Mendoza',
            comentario: 'Servicio impecable y productos de primera calidad.',
            avatar: '/images/avatar-carlos.jpg',
        },
    ];

    return (
        <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'} min-h-screen`}>
            <Head title="Swapify" />



            {/* Newsletter */}
            <button
                onClick={() => setModalNewsletter(true)}
                className="fixed bottom-20 right-4 z-50 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 cursor-pointer"
            >
                📩 Newsletter
            </button>
            {!auth.user && (
               <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-36 right-4 z-50 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 cursor-pointer"
            >
                📝 Crear Ticket
            </button>
            )}

            {/* Navbar */}
            <nav className="absolute top-0 w-full py-6 px-8 flex justify-between items-center z-20">
                <span className="text-4xl font-bold">🍹 Swapify</span>
                <div className="space-x-4">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="inline-block px-4 py-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors">
                            Panel
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="inline-block px-4 py-2 hover:underline">
                                Iniciar Sesión
                            </Link>
                            <Link href={route('register')} className="inline-block px-4 py-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors">
                                Registrarse
                            </Link>

                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section con parallax */}
            <header className="relative flex items-center justify-center h-screen overflow-hidden">
                <div
                    className="absolute inset-0 bg-no-repeat bg-fixed bg-right bg-cover"
                    style={{
                        backgroundImage: `url('fondoLandingPage.png')`,
                        backgroundSize: '100%',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0" />
                <div className="relative z-10 text-center max-w-xl px-6">
                    <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4">
                        TRADITIONAL <br />
                        MEXICAN <br />
                        TEQUILA <br />
                        <span className="text-amber-400">Derbi Raho</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8">
                        100% Blue Agave | Crafted in Mexico | 40% ALC/VOL
                    </p>
                    <Link
                        href={route('dashboard')}
                        className="inline-block px-8 py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </header>

            {/* Sección Swapify con parallax */}
            <section className="relative flex items-center justify-start h-screen overflow-hidden">
                <div
                    className="absolute inset-0 bg-no-repeat bg-fixed bg-center bg-cover"
                    style={{
                        backgroundImage: `url('/images/hero-swapify.png')`,
                        backgroundSize: '100%',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0" />
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 px-8 md:px-16 text-left max-w-xl">
                    <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4">
                        Swapify<br />
                        Botella<br />
                        Azul<br />
                        <span className="text-amber-400">Siente el Hielo</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8">
                        100% Blue Agave | Crafted in Mexico | 40% ALC/VOL
                    </p>
                    <Link
                        href={route('dashboard')}
                        className="inline-block px-8 py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors"
                    >
                        COMPRAR
                    </Link>
                </div>
            </section>

            {/* Sección Swapify con parallax */}
            <section className="relative flex items-center justify-start h-screen overflow-hidden">
                <div
                    className="absolute inset-0 bg-no-repeat bg-fixed bg-center bg-cover"
                    style={{
                        backgroundImage: `url('/images/cocteles.png')`,
                        backgroundSize: '100%',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0" />
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 px-8 md:px-16 text-left max-w-xl">
                    <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4">
                        Swapify<br />
                        Cocteles<br />
                        <span className="text-amber-400"></span>
                    </h1>
                    <Link
                        href={route('dashboard')}
                        className="inline-block px-8 py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors"
                    >
                        Recetario
                    </Link>
                </div>
            </section>

            <CreateTicketModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={auth?.user}
            />
            {modalNewsletter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white text-gray-800 p-8 rounded-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-center">¡Suscríbete y recibe ofertas!</h2>
                        <input
                            type="email"
                            placeholder="Tu correo"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-full"
                        />
                        <div className="flex justify-center space-x-4">
                            <button onClick={handleSubscribe} className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
                                Suscribirme
                            </button>

                            <button onClick={() => setModalNewsletter(false)} className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
