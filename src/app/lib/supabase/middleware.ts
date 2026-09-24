import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const GUEST_ONLY_PATHS = ['/login', '/signup', '/forgot-password']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl
  // Signed-in users are sent home from these; everyone else may view them.
  const isGuestOnly = GUEST_ONLY_PATHS.includes(pathname)
  // Reachable with or without a session (email links, recovery session).
  const isOpen = pathname.startsWith('/auth/') || pathname === '/reset-password'

  if ((!user && !isGuestOnly && !isOpen) || (user && isGuestOnly)) {
    const url = request.nextUrl.clone()
    url.pathname = user ? '/' : '/login'
    url.search = ''
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) =>
      redirect.cookies.set(name, value, options)
    )
    return redirect
  }

  return supabaseResponse
}
