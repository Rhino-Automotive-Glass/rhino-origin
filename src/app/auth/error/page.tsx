import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Error de autenticación</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          El enlace no es válido o ha expirado. Inténtalo de nuevo.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    </main>
  )
}
