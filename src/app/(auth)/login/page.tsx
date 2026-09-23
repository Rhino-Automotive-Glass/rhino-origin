'use client'

import { LoginForm } from '@rhino-automotive-glass/auth-ui'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienvenido</h2>
        <p className="text-sm text-slate-600">
          Inicia sesión para acceder al sistema
        </p>
      </div>

      <LoginForm supabase={supabase} redirectTo="/" className="max-w-none" />

      <div className="flex flex-col items-center gap-2 text-sm">
        <Link
          href="/forgot-password"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-slate-600">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
