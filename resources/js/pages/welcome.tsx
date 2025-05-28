// resources/js/Pages/PaginaBebidas.tsx
import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CreateTicketModal from './Tickets/CreateTicket';

export default function PaginaBebidas() {
    const { auth } = usePage<{ auth: { user?: { name: string } } }>().props;
    const [modalNewsletter, setModalNewsletter] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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






    return (
        <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'} min-h-screen`}>
            <Head title="Swapify" />

            {/* Newsletter - Responsivo */}
            <button
                onClick={() => setModalNewsletter(true)}
                className={`fixed bottom-20 right-4 z-50 bg-orange-600 text-white shadow-lg hover:bg-orange-700 transition-all duration-200 cursor-pointer ${
                    isMobile
                        ? 'w-12 h-12 rounded-full flex items-center justify-center text-lg'
                        : 'px-4 py-2 rounded-full'
                }`}
                title={isMobile ? 'Newsletter' : ''}
            >
                {isMobile ? '📩' : '📩 Newsletter'}
            </button>

            {!auth.user && (
                <button
                    onClick={() => setShowModal(true)}
                    className={`fixed right-4 z-50 bg-orange-600 text-white shadow-lg hover:bg-orange-700 transition-all duration-200 cursor-pointer ${
                        isMobile
                            ? 'bottom-36 w-12 h-12 rounded-full flex items-center justify-center text-lg'
                            : 'bottom-36 px-4 py-2 rounded-full'
                    }`}
                    title={isMobile ? 'Crear Ticket' : ''}
                >
                    {isMobile ? '📝' : '📝 Crear Ticket'}
                </button>
            )}

            {/* Navbar */}
            <nav className="absolute top-0 w-full py-4 md:py-6 px-4 md:px-8 flex justify-between items-center z-20">
                <span className="text-2xl md:text-4xl font-bold">🍹 Swapify</span>
                <div className="space-x-2 md:space-x-4">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="inline-block px-3 md:px-4 py-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors text-sm md:text-base">
                            Panel
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="inline-block px-3 md:px-4 py-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors text-sm md:text-base">
                                Iniciar Sesión
                            </Link>
                            <Link href={route('register')} className="inline-block px-3 md:px-4 py-2 bg-orange-400 rounded-full text-white hover:bg-orange-500 transition-colors text-sm md:text-base">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section con parallax condicional */}
            <header className="relative flex items-center justify-center h-screen overflow-hidden">
                <div
                    className={`absolute inset-0 bg-no-repeat bg-cover ${isMobile
                            ? 'bg-center'
                            : 'bg-fixed bg-right'
                        }`}
                    style={{
                        backgroundImage: `url('fondoLandingPage.png')`,
                        backgroundSize: isMobile ? 'cover' : '100%',
                        backgroundPosition: isMobile ? 'center' : 'center',
                        
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0" />
                <div className="relative z-10 text-center max-w-xl px-4 md:px-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4">
                        TRADITIONAL <br />
                        MEXICAN <br />
                        TEQUILA <br />
                        <span className="text-amber-400">Derbi Raho</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-200 mb-6 md:mb-8">
                        100% Blue Agave | Crafted in Mexico | 40% ALC/VOL
                    </p>
                    <Link
                        href={route('dashboard')}
                        className="inline-block px-6 md:px-8 py-3 md:py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors text-sm md:text-base"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </header>

            {/* Sección Swapify con parallax condicional */}
          <section className="relative flex items-center justify-start h-screen overflow-hidden">
    <div
        className={`absolute inset-0 bg-no-repeat bg-cover ${
            isMobile ? 'bg-center' : 'bg-fixed bg-center'
        }`}
        style={{
            backgroundImage: `url('/images/hero-swapify.png')`,
            backgroundSize: isMobile ? 'cover' : '100%',
            backgroundPosition: isMobile ? '70% center' : 'center',
        }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0" />
    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 px-4 md:px-8 lg:px-16 text-left max-w-xs md:max-w-xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4">
            Swapify<br />
            Botella<br />
            Azul<br />
            <span className="text-amber-400">Siente el Hielo</span>
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-6 md:mb-8">
            100% Blue Agave | Crafted in Mexico | 40% ALC/VOL
        </p>
        <Link
            href={route('dashboard')}
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors text-sm md:text-base"
        >
            COMPRAR
        </Link>
    </div>
</section>



            {/* Sección Cocteles con parallax condicional */}
            <section className="relative flex items-center justify-start h-screen overflow-hidden">
                <div
                    className={`absolute inset-0 bg-no-repeat bg-cover ${isMobile
                            ? 'bg-center'
                            : 'bg-fixed bg-center'
                        }`}
                    style={{
                        backgroundImage: `url('/images/cocteles.png')`,
                        backgroundSize: isMobile ? 'cover' : '100%',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-black/0" />
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 px-4 md:px-8 lg:px-16 text-left max-w-xs md:max-w-xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4">
                        Swapify<br />
                        Cocteles<br />
                        <span className="text-amber-400"></span>
                    </h1>
                    <Link
                        href={route('dashboard')}
                        className="inline-block px-6 md:px-8 py-3 md:py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors text-sm md:text-base"
                    >
                        Productos
                    </Link>
                </div>
            </section>

            <CreateTicketModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={auth?.user}
            />
            {modalNewsletter && (

                <div className="fixed inset-0 bg-black/50 flex items-center bg-opacity-40 backdrop-blur-sm bg-opacity-50 justify-center z-50 px-4">
                    <div className="bg-white text-gray-800 p-6 md:p-8 rounded-xl max-w-md w-full">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">¡Suscríbete y recibe ofertas!</h2>
                        <input
                            type="email"
                            placeholder="Tu correo"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-full text-gray-800"
                        />
                        <div className="flex justify-center space-x-4">
                            <button onClick={handleSubscribe} className="px-4 md:px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors text-sm md:text-base">
                                Suscribirme
                            </button>
                            <button onClick={() => setModalNewsletter(false)} className="px-4 md:px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors text-sm md:text-base">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
