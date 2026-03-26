import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../../lib/supabase'
import { getAdminSession } from '../../../../../../../lib/auth'
import { updateClickUpTask } from '../../../../../../../lib/clickup'

// PATCH /api/admin/clients/[id]/setups/[setupId]
export async function PATCH(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const updates = {}
  const oldValues = {}

  // Get current setup
  const { data: current } = await supabaseAdmin
    .from('setups')
    .select('*')
    .eq('id', params.setupId)
    .eq('client_id', params.id)
    .single()

  if (!current) return NextResponse.json({ error: 'Setup not found' }, { status: 404 })

  // Only update provided fields
  if (body.current_step !== undefined) {
    oldValues.current_step = current.current_step
    updates.current_step = body.current_step
  }
  if (body.action_step !== undefined) updates.action_step = body.action_step
  if (body.status !== undefined) updates.status = body.status
  if (body.est_date !== undefined) updates.est_date = body.est_date
  if (body.notes !== undefined) updates.notes = body.notes

  const { data: setup, error } = await supabaseAdmin
    .from('setups')
    .update(updates)
    .eq('id', params.setupId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Sync to ClickUp
  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('name')
    .eq('id', params.id)
    .single()

  await updateClickUpTask(setup.clickup_task_id, setup, client?.name || 'Unknown')

  // Log change
  await supabaseAdmin.from('setup_logs').insert({
    setup_id: setup.id,
    admin_id: session.sub,
    action: 'updated',
    old_value: oldValues,
    new_value: updates,
  })

  return NextResponse.json({ setup })
}

// DELETE /api/admin/clients/[id]/setups/[setupId]
export async function DELETE(request, { params }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabaseAdmin
    .from('setups')
    .delete()
    .eq('id', params.setupId)
    .eq('client_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
