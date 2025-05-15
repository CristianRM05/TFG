import React from 'react';
import { Dialog } from '@headlessui/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const COLORS = {
    primary: '#8F5C0C',
    secondary: '#7C5F42',
    black: '#000000',
    white: '#F3F3F1',
};

interface Props {
    open: boolean;
    onClose: () => void;
    shelfData: {
        code: string;
        location: string;
        max_capacity: string;
    };
    setShelfData: (key: string, value: any) => void;
    submitShelf: (e: React.FormEvent) => void;
    shelfErrors: any;
    processingShelf: boolean;
    clearErrors: () => void; // Añade esta prop
}

export default function ShelfModal({
    open,
    onClose,
    shelfData,
    setShelfData,
    submitShelf,
    shelfErrors,
    processingShelf,
    clearErrors,
}: Props) {
    useEffect(() => {
        if (!open) {
            // Resetear todos los campos cuando el modal se cierra
            setShelfData('code', '');
            setShelfData('location', '');
            setShelfData('max_capacity', '');
            clearErrors();

        }
    }, [open, setShelfData]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (parseFloat(shelfData.max_capacity) <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'La capacidad debe ser mayor que cero',
                icon: 'error',
                confirmButtonColor: COLORS.primary,
            });
            return;
        }

        submitShelf(e);
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30" onClick={onClose} />

            <Dialog.Panel className="relative z-50 bg-white rounded-xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]" style={{ backgroundColor: COLORS.white }}>
                <div className="flex justify-between items-center mb-6 pb-3 border-b" style={{ borderColor: COLORS.secondary }}>
                    <Dialog.Title className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        Registrar nueva estantería
                    </Dialog.Title>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={24} style={{ color: COLORS.primary }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label htmlFor="code" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Código
                        </Label>
                        <Input
                            id="code"
                            value={shelfData.code}
                            onChange={(e) => setShelfData('code', e.target.value)}
                            className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            placeholder="Ej: SH-001"
                        />
                        <InputError message={shelfErrors.code} />
                    </div>

                    <div>
                        <Label htmlFor="location" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Ubicación
                        </Label>
                        <Input
                            id="location"
                            value={shelfData.location}
                            onChange={(e) => setShelfData('location', e.target.value)}
                            className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            placeholder="Ej: Pasillo A, Sección 1"
                        />
                        <InputError message={shelfErrors.location} />
                    </div>

                    <div>
                        <Label htmlFor="max_capacity" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Capacidad Máxima
                        </Label>
                        <Input
                            id="max_capacity"
                            type="number"
                            min="1"
                            step="1"
                            value={shelfData.max_capacity}
                            onChange={(e) => setShelfData('max_capacity', e.target.value)}
                            className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            placeholder="Ej: 100"
                        />
                        <InputError message={shelfErrors.max_capacity} />
                    </div>

                    <div className="flex justify-end gap-3 pt-5 mt-6 border-t" style={{ borderColor: COLORS.secondary }}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-4 py-2"
                            style={{
                                borderColor: COLORS.secondary,
                                color: COLORS.secondary
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processingShelf}
                            className="px-4 py-2"
                            style={{
                                backgroundColor: COLORS.primary,
                                color: COLORS.white,
                                borderColor: COLORS.primary
                            }}
                        >
                            {processingShelf ? 'Procesando...' : 'Crear estantería'}
                        </Button>
                    </div>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
}
