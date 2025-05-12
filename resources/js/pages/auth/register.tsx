import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    photograph: null,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
  };

  return (
    <section className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <Head title="CREATE AN ACCOUNT" />
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-extrabold uppercase text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your details to get started
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={submit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase text-white">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="Full Name"
            />
            <InputError message={errors.name} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-xs font-bold uppercase text-white">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              value={data.last_name}
              onChange={(e) => setData('last_name', e.target.value)}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="Last Name"
            />
            <InputError message={errors.last_name} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase text-white">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="you@example.com"
            />
            <InputError message={errors.email} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                disabled={processing}
                className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                placeholder="Password"
              />
              <InputError message={errors.password} className="mt-1 text-xs text-red-500" />
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-xs font-bold uppercase text-white">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                required
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                disabled={processing}
                className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                placeholder="Confirm Password"
              />
              <InputError message={errors.password_confirmation} className="mt-1 text-xs text-red-500" />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label htmlFor="photograph" className="block text-xs font-bold uppercase text-white">
              Profile Photo
            </label>
            <input
              id="photograph"
              type="file"
              accept="image/*"
              onChange={(e) => setData('photograph', e.target.files?.[0] || null)}
              className="mt-2 text-sm text-gray-300"
            />
            <InputError message={errors.photograph} className="mt-1 text-xs text-red-500" />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 uppercase font-bold tracking-wider bg-white text-black hover:bg-gray-200 transition"
            >
              {processing ? 'Processing...' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <TextLink href={route('login')} className="font-bold hover:underline text-white">
            Log in
          </TextLink>
        </p>
      </div>
    </section>
  );
}
