import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getAdminSession } from '../../../../../lib/auth'

export async function GET(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .select(`
      id, username, name, telegram, telegram_group, created_at, last_login,
      setups(
        id, type, current_step, action_step, status,
        start_date, est_date, notes, clickup_task_id, created_at, updated_at
      )
    `)
    .eq('id', id)
    .single()

  if (error || !client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  return NextResponse.json({ client })
}

export async function PATCH(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const updates = {}

  if (body.name) updates.name = body.name.trim()
  if (body.telegram !== undefined) updates.telegram = body.telegram
  if (body.telegram_group !== undefined) updates.telegram_group = body.telegram_group
  if (body.password) updates.password_hash = await bcrypt.hash(body.password, 12)

  const { data, error } = await supabaseAdmin
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ client: data })
}

export async function DELETE(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { error } = await supabaseAdmin
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}