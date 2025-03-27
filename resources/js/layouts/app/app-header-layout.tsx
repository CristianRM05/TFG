import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
}

interface AppHeaderLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: User;
    header?: ReactNode;
}

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    user,
    header
}: PropsWithChildren<AppHeaderLayoutProps>) {
    return (
        <AppShell>
            <AppHeader
                breadcrumbs={breadcrumbs}
                user={user}
                header={header}
            />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}