"use client"

import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { GoogleIcon } from '@/components/icons/google';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), { onFinish: () => reset('password') });
  };

  useEffect(() => {
    if (errors.banned) {
      Swal.fire({
        icon: 'error',
        title: 'Cuenta suspendida',
        text: errors.banned,
        confirmButtonText: 'Entendido',
        background: '#1a1a1a',
        color: '#fff',
      });
    }
  }, [errors.banned]);

  return (
    <section className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <Head title="LOG IN" />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold uppercase text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Log in to manage your account
          </p>
          {status && (
            <p className="mt-4 text-sm text-green-500">{status}</p>
          )}
        </div>

        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase text-white">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoFocus
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

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              disabled={processing}
              className="mt-1 w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
              placeholder="••••••••"
            />
            <InputError message={errors.password} className="mt-1 text-xs text-red-500" />
            {canResetPassword && (
              <div className="text-right mt-1">
                <TextLink href={route('password.request')} className="text-xs text-gray-400 hover:text-white">
                  Forgot password?
                </TextLink>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={data.remember}
              onChange={() => setData('remember', !data.remember)}
              disabled={processing}
              className="h-4 w-4 text-white bg-transparent border-gray-600 focus:ring-white rounded"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 uppercase font-bold tracking-wider bg-white text-black hover:bg-gray-200 transition"
            >
              {processing ? 'Processing...' : 'Log In'}
            </button>
          </div>

          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </span>
            <span className="relative px-4 bg-black text-gray-400 text-sm uppercase">
              Or continue with
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => (window.location.href = route('login-google'))}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-600 rounded uppercase font-semibold text-gray-200 hover:text-white hover:border-white transition"
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <TextLink href={route('register')} className="font-bold hover:underline text-white">
            Sign up
          </TextLink>
        </p>
      </div>
    </section>
  );
}
