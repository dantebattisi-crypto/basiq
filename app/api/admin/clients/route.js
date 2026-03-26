import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../../../lib/supabase'
import { getAdminSession } from '../../../../lib/auth'

// GET /api/admin/clients — list all clients
export async function GET(request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  let query = supabaseAdmin
    .from('clients')
    .select(`
      id, username, name, telegram, created_at, last_login,
      setups (id, type, current_step, status, start_date, est_date)
    `)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ clients: data })
}

// POST /api/admin/clients — create client
export async function POST(request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, username, password, telegram, telegram_group } = await request.json()

  if (!name || !username || !password) {
    return NextResponse.json({ error: 'Name, username and password are required' }, { status: 400 })
  }

  // Check username taken
  const { data: existing } = await supabaseAdmin
    .from('clients')
    .select('id')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }

  const password_hash = await bcrypt.hash(password, 12)

  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .insert({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      password_hash,
      telegram: telegram || null,
      telegram_group: telegram_group || null,
      created_by: session.sub,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ client }, { status: 201 })
}
