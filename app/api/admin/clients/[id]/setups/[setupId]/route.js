import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../../lib/supabase'
import { getAdminSession } from '../../../../../../../lib/auth'
import { updateClickUpTask } from '../../../../../../../lib/clickup'

export async function GET(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, setupId } = await params

  const { data: setup, error } = await supabaseAdmin
    .from('setups')
    .select('*')
    .eq('id', setupId)
    .eq('client_id', id)
    .single()

  if (error || !setup) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ setup })
}

export async function PATCH(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, setupId } = await params
  const body = await request.json()

  const { data: current } = await supabaseAdmin
    .from('setups')
    .select('*')
    .eq('id', setupId)
    .eq('client_id', id)
    .single()

  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updates = {}
  const oldValues = {}
  const allowed = ['current_step', 'action_step', 'status', 'est_date', 'notes']

  for (const key of allowed) {
    if (body[key] !== undefined) {
      oldValues[key] = current[key]
      updates[key] = body[key]
    }
  }

  const { data: setup, error } = await supabaseAdmin
    .from('setups')
    .update(updates)
    .eq('id', setupId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: client } = await supabaseAdmin
    .from('clients').select('name').eq('id', id).single()
  await updateClickUpTask(setup.clickup_task_id, setup, client?.name || 'Unknown')

  await supabaseAdmin.from('setup_logs').insert({
    setup_id: setup.id,
    admin_id: session.sub,
    action: 'updated',
    old_value: oldValues,
    new_value: updates,
  })

  return NextResponse.json({ setup })
}

export async function DELETE(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, setupId } = await params

  await supabaseAdmin.from('setups').delete()
    .eq('id', setupId).eq('client_id', id)

  return NextResponse.json({ success: true })
}