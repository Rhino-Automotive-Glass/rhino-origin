# Authentication Documentation

## Overview

Rhino Origin uses Supabase for email/password authentication. The system protects all routes except `/login` and redirects unauthenticated users automatically.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. User visits any page                                        │
│  2. Middleware checks for valid session                         │
│  3. If no session → redirect to /login                          │
│  4. If session valid → allow access                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Auth                               │
│  - Manages user sessions                                         │
│  - Stores session in HTTP-only cookies                          │
│  - Validates JWT tokens                                          │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/app/
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser-side Supabase client
│   │   ├── server.ts      # Server-side Supabase client
│   │   └── middleware.ts  # Session refresh logic
│   └── auth/
│       └── actions.ts     # Server actions (signIn, signOut)
├── api/
│   └── auth/
│       └── callback/
│           └── route.ts   # OAuth callback handler
└── (auth)/
    └── login/
        └── page.tsx       # Login page

middleware.ts              # Root middleware for route protection
```

## Configuration

### Environment Variables

Create `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

### Supabase Dashboard

Add redirect URLs in Authentication → URL Configuration:
- `http://localhost:3000/api/auth/callback` (development)
- `https://your-domain.vercel.app/api/auth/callback` (production)

## How It Works

### 1. Middleware (`middleware.ts`)

Runs on every request to protect routes:

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

The `updateSession` function:
- Refreshes the session if needed
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Redirects authenticated users away from `/login`

### 2. Server Actions (`src/app/lib/auth/actions.ts`)

**Sign In:**
```typescript
export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/')
}
```

**Sign Out:**
```typescript
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### 3. Supabase Clients

**Browser Client** (`client.ts`) - For client components:
```typescript
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server Client** (`server.ts`) - For server components and API routes:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(/* ... cookie handlers ... */)
}
```

## Cross-Origin API Calls

Rhino Origin calls external APIs (e.g., rhino-product-code-description) using Bearer token authentication.

### How It Works

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Rhino Origin   │         │  Origin API     │         │  External API   │
│  (Browser)      │         │  (Proxy)        │         │  (Target)       │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         │  1. User searches         │                           │
         │  ───────────────────────► │                           │
         │                           │                           │
         │                           │  2. Get session token     │
         │                           │  ◄──────────────────────  │
         │                           │                           │
         │                           │  3. Call with Bearer token│
         │                           │  ─────────────────────────►
         │                           │  Authorization: Bearer xxx│
         │                           │                           │
         │                           │  4. Validate token        │
         │                           │  ◄─────────────────────── │
         │                           │                           │
         │  5. Return results        │                           │
         │  ◄─────────────────────── │                           │
```

### Example: Product Search API

```typescript
// src/app/api/products/search/route.ts
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Call external API with Bearer token
  const response = await fetch(
    `https://external-api.vercel.app/api/products/search?q=${query}`,
    {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    }
  )

  return NextResponse.json(await response.json())
}
```

## Adding Authentication to New Routes

All routes are protected by default via middleware. To make a route public, update `middleware.ts`:

```typescript
if (
  !user &&
  !request.nextUrl.pathname.startsWith('/login') &&
  !request.nextUrl.pathname.startsWith('/public-route')  // Add here
) {
  return NextResponse.redirect(url)
}
```

## Getting Current User

**In Server Components:**
```typescript
import { createClient } from '@/app/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return <div>Hello {user?.email}</div>
}
```

**In Client Components:**
```typescript
'use client'
import { createClient } from '@/app/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserInfo() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return <div>Hello {user?.email}</div>
}
```

## Troubleshooting

### "Unauthorized" errors
- Check that `.env.local` has correct Supabase credentials
- Verify the user is logged in
- Check browser cookies for Supabase session

### Redirect loops
- Clear browser cookies
- Check middleware logic for conflicting rules

### Cross-origin API failures
- Verify the external API accepts Bearer tokens
- Check that the access_token is being sent correctly
- Verify the external API's middleware is configured properly
