import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { signToken, verifyToken } from '../../../../../lib/auth'

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Decode(secret) {
  const s = secret.toUpperCase().replace(/=+$/, '')
  let bits = 0
  let value = 0
  const output = []
  for (const char of s) {
    const idx = BASE32_CHARS.indexOf(char)
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(output)
}

function verifyTOTP(code, secret) {
  const key = base32Decode(secret)
  const now = Math.floor(Date.now() / 1000 / 30)
  
  for (const counter of [now - 1, now, now + 1]) {
    const buf = Buffer.alloc(8)
    buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
    buf.writeUInt32BE(counter >>> 0, 4)
    const hmac = createHmac('sha1', key).update(buf).digest()
    const offset = hmac[19] & 0xf
    const otp = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000
    const generated = otp.toString().padStart(6, '0')
    console.log(`counter ${counter}: generated=${generated}, input=${code}`)
    if (generated === code.toString()) return true
  }
  return false
}

export async function POST(request) {
  try {
    const { code } = await request.json()
    const cookieStore = await cookies()
    const partialToken = cookieStore.get('admin_partial')?.value

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

    console.log('secret from DB:', admin.totp_secret)
    const isValid = verifyTOTP(code, admin.totp_secret)
    
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