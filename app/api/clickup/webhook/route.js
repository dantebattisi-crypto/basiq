import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { verifyWebhookSignature } from '../../../../lib/clickup'

// POST /api/clickup/webhook — receive status changes from ClickUp
export async function POST(request) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-signature')

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { event, task_id, history_items } = body

    // Only handle status changes
    if (event !== 'taskStatusUpdated' || !task_id) {
      return NextResponse.json({ ok: true })
    }

    // Find setup by ClickUp task ID
    const { data: setup } = await supabaseAdmin
      .from('setups')
      .select('id, type, current_step')
      .eq('clickup_task_id', task_id)
      .single()

    if (!setup) return NextResponse.json({ ok: true })

    // Map ClickUp status to our step
    const newStatus = history_items?.[0]?.after?.status?.toLowerCase()

    if (newStatus === 'complete') {
      // Mark setup as completed
      await supabaseAdmin
        .from('setups')
        .update({ status: 'completed' })
        .eq('id', setup.id)
    } else if (newStatus === 'in progress') {
      // Advance step if still in progress
      const { data: steps } = await supabaseAdmin.rpc('get_setup_steps', { setup_type: setup.type })
      // Just log the sync — step management stays in our admin
    }

    // Log the sync
    await supabaseAdmin.from('setup_logs').insert({
      setup_id: setup.id,
      admin_id: null,
      action: 'clickup_sync',
      new_value: { clickup_status: newStatus },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('ClickUp webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
