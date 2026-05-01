import { SETUP_TYPES } from './setups'

const BASE_URL = 'https://api.clickup.com/api/v2'

function getHeaders() {
  return {
    'Authorization': process.env.CLICKUP_API_TOKEN,
    'Content-Type': 'application/json',
  }
}

function mainTaskStatus(completedSteps, totalSteps, activeSteps, issueNote) {
  if (completedSteps.length >= totalSteps) return 'complete'
  if (issueNote) return 'trouble'
  if (activeSteps.length > 0) return 'in progress'
  return 'to do'
}

// Convert date string to Unix ms timestamp for ClickUp
function toTimestamp(dateStr) {
  if (!dateStr) return undefined
  return new Date(dateStr).getTime()
}

export async function createClickUpTask(setup, clientName) {
  const listId = process.env.CLICKUP_LIST_ID
  const token = process.env.CLICKUP_API_TOKEN

  if (!listId || !token) {
    console.log('ClickUp not configured — skipping')
    return null
  }

  try {
    const steps = SETUP_TYPES[setup.type]?.steps || []

    // Build main task body
    const taskBody = {
      name: `${clientName} — ${SETUP_TYPES[setup.type]?.label || setup.type}`,
      description: `Setup ID: ${setup.id}\nType: ${setup.type}\nClient: ${clientName}\n\nTotal steps: ${steps.length}`,
      status: 'to do',
    }

    // Add due date if est_date provided
    if (setup.est_date) {
      taskBody.due_date = toTimestamp(setup.est_date)
      taskBody.due_date_time = false
    }

    // Create main task
    const res = await fetch(`${BASE_URL}/list/${listId}/task`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskBody),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('ClickUp createTask error:', res.status, err)
      return null
    }

    const task = await res.json()
    console.log('ClickUp task created:', task.id)

    await Promise.all(steps.map(async (stepText, i) => {
      const stepNum = i + 1
      const subBody = {
        name: `${stepNum}. ${stepText}`,
        status: stepNum === 1 ? 'in progress' : 'to do',
        parent: task.id,
      }

      const subRes = await fetch(`${BASE_URL}/list/${listId}/task`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(subBody),
      })

      if (!subRes.ok) {
        console.error(`ClickUp subtask ${stepNum} error:`, await subRes.text())
      } else {
        console.log(`ClickUp subtask created: step ${stepNum}`)
      }
    }))

    return task.id
  } catch (err) {
    console.error('ClickUp createTask error:', err.message)
    return null
  }
}

export async function updateClickUpTask(taskId, setup, clientName) {
  if (!taskId || !process.env.CLICKUP_API_TOKEN) return

  try {
    const steps = SETUP_TYPES[setup.type]?.steps || []
    const completedSteps = setup.completed_steps || []
    const activeSteps = setup.active_steps || []

    const activeNames = activeSteps.map(n => `${n}. ${steps[n - 1] || '?'}`).join(', ')

    const descLines = [
      `Setup ID: ${setup.id}`,
      `Type: ${setup.type}`,
      `Client: ${clientName}`,
      ``,
      `Completed: ${completedSteps.length}/${steps.length}`,
      `In progress: ${activeNames || '—'}`,
    ]
    if (setup.issue_note) {
      descLines.push(``, `⚠️ ISSUE: ${setup.issue_note}`)
    }

    // Update main task
    const body = {
      status: mainTaskStatus(completedSteps, steps.length, activeSteps, setup.issue_note),
      description: descLines.join('\n'),
    }

    if (setup.est_date) {
      body.due_date = toTimestamp(setup.est_date)
      body.due_date_time = false
    }

    const [mainRes, subRes] = await Promise.all([
      fetch(`${BASE_URL}/task/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }),
      fetch(`${BASE_URL}/task/${taskId}?include_subtasks=true`, {
        headers: getHeaders(),
      }),
    ])

    if (!mainRes.ok) {
      console.error('ClickUp updateTask error:', mainRes.status, await mainRes.text())
    }

    if (!subRes.ok) return

    const taskData = await subRes.json()
    const subtasks = taskData.subtasks || []

    await Promise.all(subtasks.map((subtask) => {
      const match = subtask.name.match(/^(\d+)\./)
      if (!match) return null
      const stepNum = parseInt(match[1])

      let newStatus
      if (completedSteps.includes(stepNum)) {
        newStatus = 'complete'
      } else if (activeSteps.includes(stepNum)) {
        newStatus = 'in progress'
      } else {
        newStatus = 'to do'
      }

      if (subtask.status?.status?.toLowerCase() === newStatus) return null

      return fetch(`${BASE_URL}/task/${subtask.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      })
    }))

    console.log(`ClickUp updated: task ${taskId}, completed=[${completedSteps}], active=[${activeSteps}]`)
  } catch (err) {
    console.error('ClickUp updateTask error:', err.message)
  }
}

export function verifyWebhookSignature(body, signature) {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', process.env.CLICKUP_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex')
  return expected === signature
}