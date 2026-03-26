import { NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getAdminSession } from '../../../../../lib/auth'

// GET: generate QR code for setup
export async function GET(request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(session.email, 'BasiQ Admin', secret)
  const qrDataUrl = await QRCode.toDataURL(otpauth)

  await supabaseAdmin
    .from('admins')
    .update({ totp_secret: secret })
    .eq('id', session.sub)

  return NextResponse.json({ secret, qrDataUrl })
}

// POST: confirm 2FA setup with a valid code
export async function POST(request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await request.json()

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('totp_secret')
    .eq('id', session.sub)
    .single()

  if (!admin?.totp_secret) {
    return NextResponse.json({ error: 'No secret found. Regenerate QR code.' }, { status: 400 })
  }

  const isValid = authenticator.check(code, admin.totp_secret)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid code. Try again.' }, { status: 400 })
  }

  await supabaseAdmin
    .from('admins')
    .update({ totp_enabled: true })
    .eq('id', session.sub)

  return NextResponse.json({ success: true })
}
