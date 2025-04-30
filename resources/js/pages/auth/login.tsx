import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { GoogleIcon } from '@/components/icons/google';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout title="Welcome Back" description="Log in to manage your account and explore our catalog">
      <Head title="Log in" />

      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shsadow-2xl overflow-hidden">
        {/* Header with background image */}


        <form className="p-8 space-y-6" onSubmit={submit}>
          {status && (
            <div className="text-center text-sm text-green-600">{status}</div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-1">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-700"
              />
              <InputError message={errors.email} />
            </div>

            <div>
              <Label htmlFor="password" className="block text-gray-700 dark:text-gray-200 mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-700"
              />
              <InputError message={errors.password} />
              {canResetPassword && (
                <div className="text-right mt-1">
                  <TextLink href={route('password.request')} className="text-sm">
                    Forgot password?
                  </TextLink>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData('remember', !data.remember)}
                />
                <Label htmlFor="remember" className="ml-2 text-gray-600 dark:text-gray-300">
                  Remember me
                </Label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold shadow hover:bg-amber-500 transition"
            disabled={processing}
          >
            {processing ? <LoaderCircle className="inline-block mr-2 animate-spin" /> : null}
            Log in
          </Button>

          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </span>
            <span className="relative px-4 bg-white dark:bg-gray-800 text-gray-500 text-sm">
              Or continue with
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-gray-300 dark:border-gray-700"
            type="button"
            onClick={() => (window.location.href = route('login-google'))}
          >
            <GoogleIcon className="h-5 w-5" /> Continue with Google
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <TextLink href={route('register')}>
              Sign up
            </TextLink>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
