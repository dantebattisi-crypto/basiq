import { NextResponse } from 'next/server'
import { randomBytes, createHmac } from 'crypto'
import QRCode from 'qrcode'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getAdminSession } from '../../../../../lib/auth'

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function generateSecret() {
  const bytes = randomBytes(20)
  let secret = ''
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_CHARS[bytes[i] & 31]
  }
  return secret
}

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
    if (otp.toString().padStart(6, '0') === code.toString()) return true
  }
  return false
}

function buildOtpAuthUri(secret, email, issuer) {
  const enc = encodeURIComponent
  return `otpauth://totp/${enc(issuer)}:${enc(email)}?secret=${secret}&issuer=${enc(issuer)}&algorithm=SHA1&digits=6&period=30`
}

// GET — generate a NEW temporary secret but DO NOT save to DB yet
// Returns secret + QR code, client must confirm with code before it's saved
export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const secret = generateSecret()
  const otpauth = buildOtpAuthUri(secret, session.email, 'BasiQ')
  const qrDataUrl = await QRCode.toDataURL(otpauth)

  // Store as pending_totp_secret — NOT active yet
  await supabaseAdmin
    .from('admins')
    .update({ pending_totp_secret: secret })
    .eq('id', session.sub)

  return NextResponse.json({ secret, qrDataUrl })
}

// POST — verify code against pending secret, only then activate it
export async function POST(request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, currentCode } = await request.json()

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('totp_secret, totp_enabled, pending_totp_secret')
    .eq('id', session.sub)
    .single()

  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

  // If 2FA already enabled — require current code first
  if (admin.totp_enabled && admin.totp_secret) {
    if (!currentCode) {
      return NextResponse.json({ error: 'Current 2FA code required' }, { status: 400 })
    }
    const currentValid = verifyTOTP(currentCode, admin.totp_secret)
    if (!currentValid) {
      return NextResponse.json({ error: 'Current 2FA code is invalid' }, { status: 401 })
    }
  }

  // Verify new code against pending secret
  if (!admin.pending_totp_secret) {
    return NextResponse.json({ error: 'No pending secret. Regenerate QR code.' }, { status: 400 })
  }

  const isValid = verifyTOTP(code, admin.pending_totp_secret)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid code. Try again.' }, { status: 400 })
  }

  // Activate new secret
  await supabaseAdmin
    .from('admins')
    .update({
      totp_secret: admin.pending_totp_secret,
      pending_totp_secret: null,
      totp_enabled: true,
    })
    .eq('id', session.sub)

  return NextResponse.json({ success: true })
}