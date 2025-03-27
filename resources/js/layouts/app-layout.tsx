import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface User {
    name: string;
    email: string;
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: User; // Propiedad opcional
    header?: ReactNode; // Propiedad para el header
}

export default ({ children, breadcrumbs, user, header, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate
        breadcrumbs={breadcrumbs}
        user={user}
        header={header}
        {...props}
    >
        {children}
    </AppLayoutTemplate>
);