import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
  variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
  if (variant === 'sidebar') {
    return <SidebarInset {...props}>{children}</SidebarInset>;
  }

  return (
    <main
      className="mx-auto w-full max-w-7xl flex-1 flex flex-col gap-6 px-6 py-8 bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl"
      {...props}
    >
      {children}
    </main>
  );
}
