import React, { FormEventHandler, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import LocationAutocomplete from '@/components/LocationAutocomplete';

const MySwal = withReactContent(Swal);

export default function Register() {
  const [imagen, setImagen] = useState<File | null>(null);

  const [data, setData] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '', // ✅ nueva propiedad
    password: '',
    password_confirmation: '',
  });

  const [isLocationValid, setIsLocationValid] = useState(false); // ✅ control de validez
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [processing, setProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
      return response.data; // se espera que devuelva una URL
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

    let finalAvatar = null;

    if (imagen) {
      const uploaded = await uploadImage();
      if (!uploaded) {
        setProcessing(false);
        return MySwal.fire({
          title: 'Error',
          text: 'No se pudo subir la imagen del avatar.',
          icon: 'error',
        });
      }
      finalAvatar = uploaded;
    }

    const payload = {
      ...data,
      avatar: finalAvatar,
    };

    router.post(route('register'), payload, {
      onError: (err: any) => {
        if (err?.props?.errors) {
          setErrors(err.props.errors);
        }
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <section className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <Head title="CREAR UNA CUENTA" />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold uppercase text-white">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-400">
            Ingresa tus datos para comenzar
          </p>
        </div>

        <form className="space-y-6" onSubmit={submit}>
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase text-white">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={data.name}
              onChange={handleInputChange}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="Nombre completo"
            />
            <InputError message={errors.name?.[0]} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Apellidos */}
          <div>
            <label htmlFor="last_name" className="block text-xs font-bold uppercase text-white">Apellidos</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={data.last_name}
              onChange={handleInputChange}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="Apellidos"
            />
            <InputError message={errors.last_name?.[0]} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Correo */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase text-white">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={data.email}
              onChange={handleInputChange}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="tu@email.com"
            />
            <InputError message={errors.email?.[0]} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold uppercase text-white">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={handleInputChange}
              pattern="^[0-9]{9}$"
              maxLength={9}
              required
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="Ej: 612345678"
            />
            <InputError message={errors.phone?.[0]} className="mt-1 text-xs text-red-500" />
          </div>

        {/* Ubicación */}
<div>
  <label htmlFor="location" className="block text-xs font-bold uppercase text-white">
    Ubicación
  </label>
  <div className="mt-1 w-full">
    <LocationAutocomplete
      value={data.location}
      onChange={(value) => setData({ ...data, location: value })}
      onValidityChange={(valid) => setIsLocationValid(valid)}
      className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
      placeholder="Ej: Calle Real 23, Sevilla"
    />
  </div>
  <InputError message={errors.location?.[0]} className="mt-1 text-xs text-red-500" />
</div>


          {/* Contraseñas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase text-white">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={data.password}
                onChange={handleInputChange}
                disabled={processing}
                className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                placeholder="Contraseña"
              />
              <InputError message={errors.password?.[0]} className="mt-1 text-xs text-red-500" />
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-xs font-bold uppercase text-white">Confirmar contraseña</label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={data.password_confirmation}
                onChange={handleInputChange}
                disabled={processing}
                className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                placeholder="Confirmar contraseña"
              />
              <InputError message={errors.password_confirmation?.[0]} className="mt-1 text-xs text-red-500" />
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label htmlFor="avatar" className="block text-xs font-bold uppercase text-white">Foto de perfil</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-sm text-gray-300"
            />
            {imagen && (
              <div className="mt-2 w-24 h-24 overflow-hidden rounded-lg border border-gray-300">
                <img src={URL.createObjectURL(imagen)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <InputError message={errors.avatar?.[0]} className="mt-1 text-xs text-red-500" />
          </div>

          <div>
            <button
              type="submit"
              disabled={processing || isUploading}
              className="w-full py-4 uppercase font-bold tracking-wider bg-white text-black hover:bg-gray-200 transition"
            >
              {processing || isUploading ? 'Procesando...' : 'Crear cuenta'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <TextLink href={route('login')} className="font-bold hover:underline text-white">
            Inicia sesión
          </TextLink>
        </p>
      </div>
    </section>
  );
}
