import { useState, useEffect } from 'react';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
    name: string;
    email: string;
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: User;
    header?: ReactNode;
    initialLoading?: boolean;
    className?: string;

}

const AppLayout = ({
    children,
    breadcrumbs,
    user,
    header,
    initialLoading = true,
    ...props
}: AppLayoutProps) => {
    const [isLoading, setIsLoading] = useState(initialLoading);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <AppLayoutTemplate
  breadcrumbs={breadcrumbs}
                user={user}
                header={header}
                className={`min-h-screen ${props.className || 'bg-red-100 dark:bg-gray-900'}`}
                {...props}
            >
                {children}
            </AppLayoutTemplate>
        </>
    );
};

export default AppLayout;
