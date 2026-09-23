'use client'

import { SignupForm } from '@rhino-automotive-glass/auth-ui'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Crear Cuenta</h2>
        <p className="text-sm text-slate-600">
          Regístrate para acceder al sistema
        </p>
      </div>

      <SignupForm supabase={supabase} className="max-w-none" />

      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
