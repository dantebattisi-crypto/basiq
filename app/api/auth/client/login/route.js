import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { signToken } from '../../../../../lib/auth'
import { checkRateLimit, recordAttempt } from '../../../../../lib/rate-limit'

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    // Rate limit check
    const { allowed, remaining } = await checkRateLimit(`client:${username}`, ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 15 minutes.' },
        { status: 429 }
      )
    }

    // Find client
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .single()

    if (error || !client) {
      await recordAttempt(`client:${username}`, ip, false)
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Verify password
    const valid = await bcrypt.compare(password, client.password_hash)
    if (!valid) {
      await recordAttempt(`client:${username}`, ip, false)
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Record successful login
    await recordAttempt(`client:${username}`, ip, true)
    await supabaseAdmin
      .from('clients')
      .update({ last_login: new Date().toISOString() })
      .eq('id', client.id)

    // Sign JWT
    const token = await signToken({
      sub: client.id,
      role: 'client',
      username: client.username,
      name: client.name,
    }, '24h')

    const response = NextResponse.json({ success: true })
    response.cookies.set('client_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24h
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Client login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
