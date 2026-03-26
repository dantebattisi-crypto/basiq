import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabase'
import { getAdminSession } from '../../../../../../lib/auth'
import { createClickUpTask } from '../../../../../../lib/clickup'
import { SETUP_TYPES } from '../../../../../../lib/setups'

export async function POST(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: clientId } = await params
  const { type, start_date, est_date, notes } = await request.json()

  if (!type || !SETUP_TYPES[type]) {
    return NextResponse.json({ error: 'Invalid setup type' }, { status: 400 })
  }

  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('name')
    .eq('id', clientId)
    .single()

  const { data: setup, error } = await supabaseAdmin
    .from('setups')
    .insert({
      client_id: clientId,
      type,
      current_step: 1,
      action_step: 0,
      status: 'active',
      start_date: start_date || new Date().toISOString().split('T')[0],
      est_date: est_date || null,
      notes: notes || null,
      created_by: session.sub,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create ClickUp task
  const taskId = await createClickUpTask(setup, client?.name || 'Unknown')
  if (taskId) {
    await supabaseAdmin
      .from('setups')
      .update({ clickup_task_id: taskId })
      .eq('id', setup.id)
    setup.clickup_task_id = taskId
  }

  await supabaseAdmin.from('setup_logs').insert({
    setup_id: setup.id,
    admin_id: session.sub,
    action: 'created',
    new_value: { type, current_step: 1 },
  })

  return NextResponse.json({ setup }, { status: 201 })
}