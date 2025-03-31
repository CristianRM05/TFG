import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}
declare namespace App {
    interface PageProps {
        auth: {
            user?: import('./index').User;
        };
        shelves?: import('./index').Shelf[];
        unassignedProducts?: import('./index').Product[];
    }
}
