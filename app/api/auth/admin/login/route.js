import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { signToken } from '../../../../../lib/auth'
import { checkRateLimit, recordAttempt } from '../../../../../lib/rate-limit'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Rate limit
    const { allowed } = await checkRateLimit(`admin:${email}`, ip)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Wait 15 minutes.' }, { status: 429 })
    }

    // Find admin
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !admin) {
      await recordAttempt(`admin:${email}`, ip, false)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      await recordAttempt(`admin:${email}`, ip, false)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await recordAttempt(`admin:${email}`, ip, true)

    // If 2FA enabled — issue partial token, require TOTP
    if (admin.totp_enabled) {
      const partialToken = await signToken({
        sub: admin.id,
        role: 'admin_partial', // not fully authenticated yet
        email: admin.email,
        name: admin.name,
        totp_verified: false,
      }, '10m') // short-lived

      const response = NextResponse.json({ requires2FA: true })
      response.cookies.set('admin_partial', partialToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10,
        path: '/',
      })
      return response
    }

    // No 2FA — issue full token
    const token = await signToken({
      sub: admin.id,
      role: 'admin',
      email: admin.email,
      name: admin.name,
      totp_verified: true,
    }, '8h')

    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    const response = NextResponse.json({ success: true, requires2FA: false })
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
