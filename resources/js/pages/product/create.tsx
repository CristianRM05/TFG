import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import Swal from 'sweetalert2';
import { useForm } from '@inertiajs/react';
import { Camera, Upload, X } from 'lucide-react';

const COLORS = {
    primary: '#8F5C0C',
    secondary: '#7C5F42',
    black: '#000000',
    white: '#F3F3F1',
};

interface Props {
    open: boolean;
    onClose: () => void;
    categorias: Categoria[];
    productData: any;
    setProductData: (key: string, value: any) => void;
    submitProduct: (e: React.FormEvent) => void;
    productErrors: any;
    processingProduct: boolean;
    resetProduct: () => void;
}



export default function ProductModal({

    open,
    onClose,
    categorias: initialCategorias,
    productData,
    setProductData,
    submitProduct,
    productErrors,
    processingProduct,
    resetProduct,


}: Props) {
    const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
    const handleClose = () => {
        reset();        // <-- useForm del modal
        clearErrors();  // <-- useForm del modal
        onClose();
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        description: "",
        num_reference: "",
        stock: "",
        categoria: "",
        price: "",
        image_url: "",
    });

    useEffect(() => {
        if (open) {
            setData({
                name: productData.name || '',
                description: productData.description || '',
                num_reference: productData.num_reference || '',
                stock: productData.stock || '',
                categoria: productData.categoria || '',
                price: productData.price || '',
                image_url: productData.image_url || '',
            });
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const uploadToImgBB = async (file: File): Promise<string | null> => {
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '6512c2d5a06b884ad74a74727c6e6332';

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            return result.data?.url || null;
        } catch (error) {
            console.error('❌ Error al subir la imagen a ImgBB:', error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const price = parseFloat(data.price);
        const stock = parseInt(data.stock);

        if (price <= 0 || stock <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'El precio y el stock no pueden ser 0.',
                icon: 'error',
                showConfirmButton: false,
                timer: 1800,
            });
            return;
        }

        let imageUrl = '';
        if (data.image_url instanceof File) {
            const uploadedUrl = await uploadToImgBB(data.image_url);
            if (!uploadedUrl) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo subir la imagen a ImgBB.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: COLORS.primary,
                });
                return;
            }
            imageUrl = uploadedUrl;
        } else if (typeof data.image_url === 'string') {
            imageUrl = data.image_url;
        }

        const formData = {
            ...data,
            image_url: imageUrl,
            price: price,
            stock: stock,
            categoria: data.categoria || null,
        };

        const isAdmin = window.location.pathname.includes('/admin/');
        const rolePrefix = isAdmin ? 'admin' : 'manager';

        post(`/${rolePrefix}/products`, {
                    preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Producto e inventario creados con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showConfirmButton: false,
                    confirmButtonColor: COLORS.primary,
                    timer: 3000,
                });
                reset();
                onClose();
                fetch('/admin/users?page=1')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Actualizar el contador de usuarios en el componente padre
                            window.dispatchEvent(new CustomEvent('updateTotalUsers', {
                                detail: { total: data.pagination.total }
                            }));
                        }
                    });

                fetch('/admin/shelves?page=1')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Actualizar el contador de estanterías en el componente padre
                            window.dispatchEvent(new CustomEvent('updateTotalShelves', {
                                detail: { total: data.pagination.total }
                            }));
                        }
                    });

                fetch('/admin/products?page=1')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            const newTotal = data.pagination.total;
                            const newLastPage = data.pagination.last_page;

                            // Actualizar el contador de productos en el componente padre
                            window.dispatchEvent(new CustomEvent('updateTotalProducts', {
                                detail: {
                                    total: newTotal,
                                    lastPage: newLastPage
                                }
                            }));

                            // Obtener productos de la última página
                            fetch(`/admin/products?page=${newLastPage}&per_page=5`)
                                .then(response => response.json())
                                .then(pageData => {
                                    if (pageData.success) {
                                        // Actualizar la lista de productos en el componente padre
                                        // Calcular el número correcto de páginas
                                        const totalPages = Math.ceil(newTotal / 5); // Asumiendo 5 productos por página

                                        window.dispatchEvent(new CustomEvent('updateTotalProducts', {
                                            detail: {
                                                total: newTotal,
                                                lastPage: newLastPage,
                                                totalPages: totalPages,
                                                perPage: 5 // Asegúrate de que este valor coincida con productsPerPage
                                            }
                                        }));

                                        console.log("Enviando evento updateTotalProducts:", {
                                            total: newTotal,
                                            lastPage: newLastPage,
                                            totalPages: totalPages
                                        });
                                    }
                                });
                        }
                    });
            },
            onError: (errors) => {
                console.error('Error al crear producto:', errors);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al crear el producto',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    showConfirmButton: false,
                    timer: 3000,
                    confirmButtonColor: COLORS.secondary,
                });
            },
        });
    };

    useEffect(() => {
        const basePath = window.location.pathname.includes('admin') ? '/admin' : '/manager';
        fetch(`${basePath}/products/categorias`)
                .then(response => response.json())
            .then(data => setCategorias(data))
            .catch(error => console.error('Error al obtener categorías:', error));
    }, []);

    return (
        <Dialog open={open} onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                aria-hidden="true"
                style={{ zIndex: 40 }}
                onClick={handleClose}
            ></div>
            {/* Modal Panel */}
            <Dialog.Panel className="relative z-50 bg-white rounded-xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]" style={{ backgroundColor: COLORS.white }}>
                <div className="flex justify-between items-center mb-6 pb-3 border-b" style={{ borderColor: COLORS.secondary }}>
                    <Dialog.Title className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        Registrar nuevo producto
                    </Dialog.Title>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={24} style={{ color: COLORS.primary }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                                style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="num_reference" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                                Referencia
                            </Label>
                            <Input
                                id="num_reference"
                                value={data.num_reference}
                                onChange={e => setData('num_reference', e.target.value)}
                                className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                                style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            />
                            <InputError message={errors.num_reference} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Descripción
                        </Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, backgroundColor: COLORS.white, color: COLORS.black }}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="stock" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                                Stock
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                step="1"
                                min="0"
                                value={data.stock}
                                onChange={e => setData('stock', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e" || e.key === "E") {
                                        e.preventDefault(); // bloquea negativo y notación científica
                                    }
                                }}
                                className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                                style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            />
                            <InputError message={errors.stock} />
                        </div>

                        <div>
                            <Label htmlFor="price" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                                Precio (€)
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e" || e.key === "E") {
                                        e.preventDefault(); // bloquea negativo y notación científica
                                    }
                                }}
                                className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                                style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            />
                            <InputError message={errors.price} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="categoria" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Categoría
                        </Label>
                        <select
                            id="categoria"
                            value={data.categoria || ''}
                            onChange={e => setData('categoria', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{
                                borderColor: COLORS.secondary,
                                backgroundColor: COLORS.white,
                                color: COLORS.black
                            }}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map(c => (
                                <option key={c.value} value={c.value}>
                                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.categoria} />
                    </div>

                    <div>
                        <Label htmlFor="image_url" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Fotografía
                        </Label>
                        <Input
                            id="image_url"
                            type="file"
                            accept="image/*"
                            className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const uploadedUrl = await uploadToImgBB(file);
                                    if (!uploadedUrl) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error al subir imagen',
                                            text: 'No se pudo subir la imagen a ImgBB.',
                                            confirmButtonColor: COLORS.primary
                                        });
                                        return;
                                    }
                                    setData('image_url', uploadedUrl);
                                }
                            }}
                        />
                        <InputError message={errors.image_url} />
                    </div>

                    <div className="flex justify-end gap-3 pt-5 mt-6 border-t" style={{ borderColor: COLORS.secondary }}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
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
                            disabled={processing}
                            className="px-4 py-2"
                            style={{
                                backgroundColor: COLORS.primary,
                                color: COLORS.white,
                                borderColor: COLORS.primary
                            }}
                        >
                            {processing ? 'Procesando...' : 'Crear producto'}
                        </Button>
                    </div>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
}
