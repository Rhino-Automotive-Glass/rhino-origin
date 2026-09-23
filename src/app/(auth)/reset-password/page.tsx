'use client'

import { UpdatePasswordForm } from '@rhino-automotive-glass/auth-ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

// Reached from the recovery email via /auth/callback, which sets the recovery session.
export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Nueva Contraseña
        </h2>
        <p className="text-sm text-slate-600">Elige una nueva contraseña</p>
      </div>

      <UpdatePasswordForm
        supabase={supabase}
        onSuccess={() => router.replace('/')}
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
