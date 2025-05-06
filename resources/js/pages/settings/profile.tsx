// IMPORTS
import React, { FormEventHandler, useState } from 'react';
import axios from 'axios';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { type BreadcrumbItem, type SharedData } from '@/types';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import LocationAutocomplete from '@/components/LocationAutocomplete';

const MySwal = withReactContent(Swal);

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Profile settings', href: '/settings/profile' },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();

  const [imagen, setImagen] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    avatar: string;
    location: string;
  }>({
    name: auth.user.name,
    email: auth.user.email,
    avatar: auth.user.avatar ?? '',
    location: typeof auth.user.location === 'string' ? auth.user.location : '',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imagen) return null;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      const response = await axios.post('/subir-imagen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsUploading(false);
      return response.data;
    } catch (error) {
      console.error('❌ Error al subir el avatar:', error);
      setIsUploading(false);
      return null;
    }
  };

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    if (!isLocationValid) {
      setProcessing(false);
      return MySwal.fire({
        title: 'Ubicación inválida',
        text: 'Por favor selecciona una dirección válida de las sugerencias.',
        icon: 'warning',
      });
    }

    let finalAvatar = form.avatar;

    if (imagen) {
      const uploaded = await uploadImage();
      if (!uploaded) {
        setProcessing(false);
        return MySwal.fire({
          title: 'Error',
          text: 'No se pudo subir el avatar.',
          icon: 'error',
        });
      }
      finalAvatar = uploaded;
    }

    const payload = {
      name: form.name,
      email: form.email,
      avatar: finalAvatar,
      location: form.location,
    };

    router.patch(route('profile.update'), payload, {
      preserveScroll: true,
      onSuccess: () => {
        MySwal.fire({
          title: '¡Perfil actualizado!',
          text: 'Tus cambios se han guardado correctamente 😊',
          icon: 'success',
          confirmButtonColor: '#567568',
        });
      },
      onError: (err: any) => {
        console.error('❌ Error al actualizar:', err);
        if (err?.props?.errors) {
          setErrors(err.props.errors);
        }
        MySwal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar tu perfil.',
          icon: 'error',
        });
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <AppLayout className="bg-black" breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />
      <SettingsLayout>
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24 rounded-full ring-2 ring-blue-500 shadow-lg">
            <AvatarImage src={imagen ? URL.createObjectURL(imagen) : form.avatar} alt={form.name} />
            <AvatarFallback>{getInitials(form.name)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Update your name, email and location" />

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleInputChange} required />
              {errors.name && <InputError className="mt-2" message={errors.name[0]} />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleInputChange} required />
              {errors.email && <InputError className="mt-2" message={errors.email[0]} />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Ubicación</Label>
              <LocationAutocomplete
                value={form.location}
                onChange={(value) => setForm({ ...form, location: value })}
                onValidityChange={(valid) => setIsLocationValid(valid)}
              />
              {errors.location && <InputError className="mt-2" message={errors.location[0]} />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} />
              {imagen && (
                <div className="mt-2 w-24 h-24 overflow-hidden rounded-lg border border-gray-300">
                  <img src={URL.createObjectURL(imagen)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              {errors.avatar && <InputError className="mt-2" message={errors.avatar[0]} />}
            </div>

            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div>
                <p className="text-muted-foreground text-sm">
                  Your email address is unverified.{' '}
                  <Link href={route('verification.send')} method="post" as="button" className="underline">
                    Click here to resend the verification email.
                  </Link>
                </p>
                {status === 'verification-link-sent' && (
                  <div className="mt-2 text-sm text-green-600">
                    A new verification link has been sent to your email address.
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button disabled={processing || isUploading}>
                {isUploading ? 'Subiendo avatar...' : 'Guardar cambios'}
              </Button>

              <Transition
                show={!processing}
                enter="transition-opacity duration-300"
                leave="transition-opacity duration-300"
                enterFrom="opacity-0"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Guardado</p>
              </Transition>
            </div>
          </form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
