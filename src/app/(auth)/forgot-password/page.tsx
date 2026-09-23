'use client'

import { ForgotPasswordForm } from '@rhino-automotive-glass/auth-ui'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Recuperar Contraseña
        </h2>
        <p className="text-sm text-slate-600">
          Te enviaremos un enlace para restablecerla
        </p>
      </div>

      <ForgotPasswordForm
        supabase={supabase}
        resetPath="/reset-password"
        className="max-w-none"
      />

      <Link
        href="/login"
        className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        Volver a iniciar sesión
      </Link>
    </div>
  )
}
