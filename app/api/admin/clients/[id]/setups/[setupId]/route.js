import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../../lib/supabase'
import { getAdminSession } from '../../../../../../../lib/auth'
import { updateClickUpTask } from '../../../../../../../lib/clickup'
import { SETUP_TYPES } from '../../../../../../../lib/setups'

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
  const allowed = ['current_step', 'action_step', 'active_steps', 'status', 'est_date', 'notes', 'completed_steps']

  for (const key of allowed) {
    if (body[key] !== undefined) {
      oldValues[key] = current[key]
      updates[key] = body[key]
    }
  }

  // Auto-compute current_step from completed_steps for backwards compatibility
  if (updates.completed_steps !== undefined) {
    const steps = SETUP_TYPES[current.type]?.steps || []
    const allNums = steps.map((_, i) => i + 1)
    const uncompleted = allNums.filter(n => !updates.completed_steps.includes(n))
    updates.current_step = uncompleted.length > 0 ? Math.min(...uncompleted) : steps.length + 1
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