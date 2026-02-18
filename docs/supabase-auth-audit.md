# Supabase Auth Audit

**Date:** 2026-02-18
**Scope:** All Supabase auth calls that require a `redirectTo` / `emailRedirectTo` option

---

## Methods audited

| Method | Found | File |
|---|---|---|
| `signInWithOAuth` | No | — |
| `signInWithMagicLink` | No | — |
| `signInWithOtp` | No | — |
| `resetPasswordForEmail` | No | — |
| `updateUser` (email change) | No | — |
| `signUp` | **Yes** | `src/app/lib/auth/actions.ts:30` |
| `verifyOtp` | No | — |

---

## Issues found

### Issue 1 — Operator-precedence bug in `siteUrl` construction

**File:** `src/app/lib/auth/actions.ts:26-28`

**Before:**
```ts
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'
```

Due to JavaScript operator precedence, the ternary binds to the entire `||` expression, not just `process.env.VERCEL_URL`. The code was evaluated as:

```ts
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL)
  ? `https://${process.env.VERCEL_URL}`   // always taken when NEXT_PUBLIC_SITE_URL is set
  : 'http://localhost:3000'
```

**Effect:** `NEXT_PUBLIC_SITE_URL` was completely ignored. If it was set but `VERCEL_URL` was not, `siteUrl` resolved to `"https://undefined"`.

---

### Issue 2 — `emailRedirectTo` pointed to non-standard path

**File:** `src/app/lib/auth/actions.ts:34`

The `signUp` call sent confirmation emails with:
```
emailRedirectTo: `${siteUrl}/api/auth/callback`
```

The `/api/auth/callback` route existed and worked, but the conventional `@supabase/ssr` path is `/auth/callback`. Using the API-prefixed path is inconsistent with standard Supabase Next.js patterns.

---

### Issue 3 — Callback route lacked error handling and `next` param support

**File:** `src/app/api/auth/callback/route.ts`

**Before:**
```ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)  // errors silently ignored
  }

  return NextResponse.redirect(`${origin}/`)  // always redirects to root
}
```

Two problems:
1. `exchangeCodeForSession` errors were silently swallowed — a failed exchange still redirected to `/` with no feedback to the user
2. No `?next=` param support, so there was no way to send users back to the page they originally came from after confirming their email

---

## Fixes applied

### Fix 1 — Corrected `siteUrl` operator precedence

**File:** `src/app/lib/auth/actions.ts`

```ts
// Before
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

// After
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
```

Priority order is now correct: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` (with `https://` prefix) → `localhost:3000`.

---

### Fix 2 — Created `/auth/callback` route

**File created:** `src/app/auth/callback/route.ts`

```ts
import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
```

Follows the standard `@supabase/ssr` pattern for Next.js App Router.

---

### Fix 3 — Updated `emailRedirectTo` to use new route

**File:** `src/app/lib/auth/actions.ts`

```ts
// Before
emailRedirectTo: `${siteUrl}/api/auth/callback`

// After
emailRedirectTo: `${siteUrl}/auth/callback`
```

---

### Fix 4 — Improved existing `/api/auth/callback` route

**File:** `src/app/api/auth/callback/route.ts`

Applied the same error handling and `?next=` param support as the new `/auth/callback` route. The old route was kept and improved rather than deleted, since previously sent confirmation emails may still contain links pointing to `/api/auth/callback`.

---

## Summary

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | `siteUrl` operator-precedence bug caused `NEXT_PUBLIC_SITE_URL` to be ignored | High | Fixed |
| 2 | `emailRedirectTo` pointed to non-standard `/api/auth/callback` path | Low | Fixed |
| 3 | Callback route silently swallowed `exchangeCodeForSession` errors | Medium | Fixed |
| 4 | Callback route did not support `?next=` post-auth redirect param | Low | Fixed |

**Files changed:**
- `src/app/lib/auth/actions.ts` — siteUrl fix + emailRedirectTo path update
- `src/app/auth/callback/route.ts` — new route (canonical callback handler)
- `src/app/api/auth/callback/route.ts` — improved with error handling and next param

**No other auth methods required changes** — `signInWithOAuth`, `signInWithMagicLink`, `signInWithOtp`, `resetPasswordForEmail`, `updateUser`, and `verifyOtp` are not currently used in this codebase.
