import { NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { signToken, verifyToken } from '../../../../../lib/auth'

export async function POST(request) {
  try {
    const { code } = await request.json()
    const partialToken = request.cookies.get('admin_partial')?.value

    if (!partialToken) {
      return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 })
    }

    const payload = await verifyToken(partialToken)
    if (!payload || payload.role !== 'admin_partial') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { data: admin } = await supabaseAdmin
      .from('admins')
      .select('id, totp_secret, email, name')
      .eq('id', payload.sub)
      .single()

    if (!admin || !admin.totp_secret) {
      return NextResponse.json({ error: 'TOTP not configured' }, { status: 400 })
    }

    const isValid = authenticator.check(code, admin.totp_secret)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 })
    }

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

    const response = NextResponse.json({ success: true })
    response.cookies.delete('admin_partial')
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('2FA verify error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
