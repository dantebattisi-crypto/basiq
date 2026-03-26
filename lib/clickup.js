import { SETUP_TYPES } from './setups'

const BASE_URL = 'https://api.clickup.com/api/v2'

function getHeaders() {
  return {
    'Authorization': process.env.CLICKUP_API_TOKEN,
    'Content-Type': 'application/json',
  }
}

function stepToStatus(type, step) {
  const steps = SETUP_TYPES[type]?.steps || []
  const total = steps.length
  if (step >= total) return 'complete'
  if (step === 1) return 'to do'
  return 'in progress'
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

    // Create subtasks using parent field
    for (let i = 0; i < steps.length; i++) {
      const stepNum = i + 1
      const isFirst = stepNum === 1

      const subBody = {
        name: `${stepNum}. ${steps[i]}`,
        status: isFirst ? 'in progress' : 'to do',
        parent: task.id,
      }

      const subRes = await fetch(`${BASE_URL}/list/${listId}/task`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(subBody),
      })

      if (!subRes.ok) {
        const err = await subRes.text()
        console.error(`ClickUp subtask ${stepNum} error:`, err)
      } else {
        console.log(`ClickUp subtask created: step ${stepNum}`)
      }
    }

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
    const currentStepName = steps[setup.current_step - 1] || 'Unknown'

    // Update main task
    const body = {
      status: stepToStatus(setup.type, setup.current_step),
      description: `Setup ID: ${setup.id}\nType: ${setup.type}\nClient: ${clientName}\n\nCurrent step ${setup.current_step}/${steps.length}: ${currentStepName}`,
    }

    if (setup.est_date) {
      body.due_date = toTimestamp(setup.est_date)
      body.due_date_time = false
    }

    const res = await fetch(`${BASE_URL}/task/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error('ClickUp updateTask error:', res.status, await res.text())
      return
    }

    // Get subtasks
    const subRes = await fetch(`${BASE_URL}/task/${taskId}?include_subtasks=true`, {
      headers: getHeaders(),
    })

    if (!subRes.ok) return

    const taskData = await subRes.json()
    const subtasks = taskData.subtasks || []

    for (const subtask of subtasks) {
      const match = subtask.name.match(/^(\d+)\./)
      if (!match) continue
      const stepNum = parseInt(match[1])

      let newStatus
      if (stepNum < setup.current_step) {
        newStatus = 'complete'
      } else if (stepNum === setup.current_step) {
        newStatus = 'in progress'
      } else {
        newStatus = 'to do'
      }

      const currentStatus = subtask.status?.status?.toLowerCase()
      if (currentStatus !== newStatus) {
        await fetch(`${BASE_URL}/task/${subtask.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status: newStatus }),
        })
      }
    }

    console.log(`ClickUp updated: task ${taskId}, step ${setup.current_step}`)
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