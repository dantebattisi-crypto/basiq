import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

  // ── Admin routes ──────────────────────────────────────────────────
  if (pathname.startsWith(`/${SEGMENT}`)) {
    const token = request.cookies.get('admin_session')?.value
    const payload = token ? await verifyToken(token) : null

    if (!payload || payload.role !== 'admin') {
      // Return 404 — don't reveal the path exists
      return new NextResponse(null, { status: 404 })
    }

    // Require completed 2FA
    if (!payload.totp_verified) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('step', '2fa')
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // ── Client routes ─────────────────────────────────────────────────
  if (pathname.startsWith('/client/')) {
    const token = request.cookies.get('client_session')?.value
    const payload = token ? await verifyToken(token) : null

    if (!payload || payload.role !== 'client') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/clickup/webhook).*)',
  ],
}
