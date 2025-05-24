import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    LayoutGrid,
    User,
    ShoppingCart,
    Menu,
    X,
    Package2,
    Gift,
    DiscIcon,
    BarChart3
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import AvailableCouponsModal from './AvailableCouponsModal';
import NewsletterModal from './NewsletterModal';
import CreateCouponModal from './CreateCoupon';

export function AppHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [showCouponsModal, setShowCouponsModal] = useState(false);

    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    // Navigation items based on user role
    const getNavItems = (): NavItem[] => {
        const userRole = auth.user?.role ?? null;

        if (userRole === "Admin") {
            return [
                {
                    title: 'Home',
                    href: '/',
                    icon: Home
                }
            ];
        } else if (userRole === "Manager") {
            return [
                {
                    title: 'Dashboard',
                    href: '/manager/dashboard',
                    icon: LayoutGrid
                },
                {
                    title: 'Movimientos',
                    href: '/manager/movimientos',
                    icon: BarChart3
                },
                {
                    title: 'Pedidos',
                    href: '/manager/orders',
                    icon: ShoppingCart
                },
                {
                    title: 'Descuentos',
                    href: '/manager/discounts',
                    icon: DiscIcon
                },

            ];
        } else if (userRole === "Cliente") {
            return [
                {
                    title: 'Cupones',
                    href: '/',
                    icon: Gift,

                },
                {
                    title: 'Productos',
                    href: '/dashboard',
                    icon: LayoutGrid
                },
                {
                    title: 'Perfil',
                    href: '/settings/profile',
                    icon: User
                },
                {
                    title: 'Mis pedidos',
                    href: '/my-orders',
                    icon: Package2
                }
            ];
        } else {
            return [];
        }
    };

    const navItems = getNavItems();

    return (
        <header style={{ backgroundColor: 'var(--nav-bg)' }} className="shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between relative">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 group"
                    >
                        <div style={{ backgroundColor: 'var(--nav-logo-bg)', color: 'var(--nav-logo-text)' }} className="w-24 h-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
                            <span className="font-bold text-lg">Swapify</span>
                        </div>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden z-50 relative"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-red" />
                        ) : (
                            <Menu style={{ color: 'var(--nav-item-icon)' }} className="w-6 h-6" />
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => {
                            const isActive = page.url === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center space-x-2 px-3 py-2 rounded-full
                    transition-all duration-300 group
                  `}
                                    style={{
                                        backgroundColor: isActive ? 'var(--nav-item-active-bg)' : 'transparent',
                                        color: isActive ? 'var(--nav-item-active-text)' : 'var(--nav-item-text)'
                                    }}
                                >
                                    {item.icon && (
                                        <item.icon
                                            className="w-5 h-5"
                                            style={{
                                                color: isActive ? 'var(--nav-item-active-text)' : 'var(--nav-item-icon)'
                                            }}
                                        />
                                    )}
                                    <span className="font-medium">{item.title}</span>
                                    <style>{`
                    .group:hover {
                      background-color: ${isActive ? 'var(--nav-item-active-bg)' : 'var(--nav-item-hover-bg)'};
                      color: ${isActive ? 'var(--nav-item-active-text)' : 'var(--nav-item-hover-text)'};
                    }
                    .group:hover svg {
                      color: ${isActive ? 'var(--nav-item-active-text)' : 'var(--nav-item-hover-text)'};
                    }
                  `}</style>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Shopping Cart for Clients */}
                        {auth.user?.role !== "Admin" && auth.user?.role !== "Manager" && (
                            <Link
                                href="/cart"
                                className="transition-colors"
                                style={{ color: 'var(--nav-item-text)' }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--nav-item-hover-text)'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--nav-item-text)'}
                            >
                                <ShoppingCart className="w-6 h-6" />
                            </Link>
                        )}

                        {/* Admin Options */}
                        {auth.user?.role === "Admin" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-52" align="end">
                                    <div className="px-2 py-1 text-xs text-gray-500">Opciones de administrador</div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-md transition"
                                    >
                                        ➕ Crear Cupón
                                    </button>
                                    <button
                                        onClick={() => setShowNewsletterModal(true)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-md transition"
                                    >
                                        📨 Enviar Newsletter
                                    </button>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* User Avatar Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full hover:ring-2" style={{ '--ring-color': 'var(--avatar-ring)' } as React.CSSProperties}>
                                        <AvatarImage src={auth.user?.avatar || undefined} alt={auth.user?.name || 'Usuario'} />
                                        <AvatarFallback>
                                            {auth.user ? getInitials(auth.user.name) : 'U'}
                                        </AvatarFallback>

                                    </Avatar>
                                    <style>{`
                    .hover\:ring-2:hover {
                      --tw-ring-color: var(--avatar-ring);
                    }
                  `}</style>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                                {/* Show coupons only for clients */}
                                {auth.user?.role !== "Admin" && auth.user?.role !== "Manager" && (
                                    <div className="px-2 py-1">
                                        <button
                                            onClick={() => setShowCouponsModal(true)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md transition text-gray-800"
                                        >
                                            🎟️ Ver mis cupones
                                        </button>
                                    </div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-40 md:hidden" style={{ backgroundColor: 'var(--nav-bg)' }}>
                        <div className="flex flex-col items-center justify-center h-full space-y-6">
                            {navItems.map((item) => {
                                const isActive = page.url === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-4 px-6 py-3 rounded-full w-64 justify-center transition-all duration-300"
                                        style={{
                                            backgroundColor: isActive ? 'var(--nav-item-active-bg)' : 'transparent',
                                            color: isActive ? 'var(--nav-item-active-text)' : 'var(--nav-item-text)'
                                        }}
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className="w-6 h-6"
                                                style={{
                                                    color: isActive ? 'var(--nav-item-active-text)' : 'var(--nav-item-icon)'
                                                }}
                                            />
                                        )}
                                        <span className="text-xl font-medium">{item.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateCouponModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <AvailableCouponsModal
                show={showCouponsModal}
                handleClose={() => setShowCouponsModal(false)}
            />

            <NewsletterModal
                isOpen={showNewsletterModal}
                onClose={() => setShowNewsletterModal(false)}
            />
        </header>
    );
}

export default AppHeader;
