import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { verifyWebhookSignature } from '../../../../lib/clickup'
import { SETUP_TYPES } from '../../../../lib/setups'

const CLICKUP_BASE = 'https://api.clickup.com/api/v2'
const LOOP_GUARD_SECONDS = 15

async function fetchClickUpTask(taskId) {
  const res = await fetch(`${CLICKUP_BASE}/task/${taskId}`, {
    headers: { Authorization: process.env.CLICKUP_API_TOKEN },
  })
  if (!res.ok) return null
  return res.json()
}

// POST /api/clickup/webhook — receive status changes from ClickUp
export async function POST(request) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-signature')

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { event, task_id, history_items } = body

    if (event !== 'taskStatusUpdated' || !task_id) {
      return NextResponse.json({ ok: true })
    }

    const newStatus = history_items?.[0]?.after?.status?.toLowerCase()
    if (!newStatus) return NextResponse.json({ ok: true })

    // Fetch task from ClickUp to know if it's a subtask (has parent)
    const task = await fetchClickUpTask(task_id)
    if (!task) return NextResponse.json({ ok: true })

    const parentId = task.parent || null
    const lookupId = parentId ?? task_id

    // Find setup by main task ID
    const { data: setup } = await supabaseAdmin
      .from('setups')
      .select('id, type, status, completed_steps, active_steps')
      .eq('clickup_task_id', lookupId)
      .single()

    if (!setup) return NextResponse.json({ ok: true })

    // Loop guard: skip if our own code updated this setup in the last N seconds
    const { data: lastLog } = await supabaseAdmin
      .from('setup_logs')
      .select('created_at')
      .eq('setup_id', setup.id)
      .eq('action', 'updated')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastLog) {
      const secsSince = (Date.now() - new Date(lastLog.created_at).getTime()) / 1000
      if (secsSince < LOOP_GUARD_SECONDS) {
        return NextResponse.json({ ok: true })
      }
    }

    const updates = {}

    if (parentId) {
      // --- SUBTASK: update completed_steps / active_steps ---
      const match = task.name.match(/^(\d+)\./)
      if (!match) return NextResponse.json({ ok: true })
      const stepNum = parseInt(match[1])

      let completed = [...(setup.completed_steps || [])]
      let active = [...(setup.active_steps || [])]

      if (newStatus === 'complete') {
        if (!completed.includes(stepNum)) completed.push(stepNum)
        active = active.filter(n => n !== stepNum)
      } else if (newStatus === 'in progress') {
        if (!active.includes(stepNum)) active.push(stepNum)
        completed = completed.filter(n => n !== stepNum)
      } else {
        // 'to do' — remove from both
        active = active.filter(n => n !== stepNum)
        completed = completed.filter(n => n !== stepNum)
      }

      updates.completed_steps = completed
      updates.active_steps = active

      // Recalculate current_step (first uncompleted step)
      const steps = SETUP_TYPES[setup.type]?.steps || []
      const allNums = steps.map((_, i) => i + 1)
      const uncompleted = allNums.filter(n => !completed.includes(n))
      updates.current_step = uncompleted.length > 0 ? Math.min(...uncompleted) : steps.length + 1

    } else {
      // --- MAIN TASK: update setup status ---
      // 'trouble' = active in our system, clients don't see it
      if (newStatus === 'complete' && setup.status !== 'completed') {
        updates.status = 'completed'
      } else if (newStatus === 'in progress' && setup.status === 'completed') {
        updates.status = 'active'
      }
      // 'trouble' / 'to do' — no DB status change
    }

    if (Object.keys(updates).length === 0) return NextResponse.json({ ok: true })

    await supabaseAdmin.from('setups').update(updates).eq('id', setup.id)

    await supabaseAdmin.from('setup_logs').insert({
      setup_id: setup.id,
      admin_id: null,
      action: 'clickup_sync',
      new_value: { clickup_status: newStatus, ...updates },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('ClickUp webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
