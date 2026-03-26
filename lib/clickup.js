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

export async function createClickUpTask(setup, clientName) {
  const listId = process.env.CLICKUP_LIST_ID
  const token = process.env.CLICKUP_API_TOKEN

  if (!listId || !token) {
    console.log('ClickUp not configured — skipping task creation')
    return null
  }

  try {
    const res = await fetch(`${BASE_URL}/list/${listId}/task`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: `${clientName} — ${SETUP_TYPES[setup.type]?.label || setup.type}`,
        description: `Setup ID: ${setup.id}\nType: ${setup.type}\nClient: ${clientName}`,
        status: 'to do',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('ClickUp createTask error:', res.status, err)
      return null
    }

    const data = await res.json()
    console.log('ClickUp task created:', data.id)
    return data.id
  } catch (err) {
    console.error('ClickUp createTask error:', err.message)
    return null
  }
}

export async function updateClickUpTask(taskId, setup, clientName) {
  if (!taskId) return
  const token = process.env.CLICKUP_API_TOKEN
  if (!token) return

  try {
    const steps = SETUP_TYPES[setup.type]?.steps || []
    const currentStepName = steps[setup.current_step - 1] || 'Unknown'

    const res = await fetch(`${BASE_URL}/task/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        status: stepToStatus(setup.type, setup.current_step),
        description: `Setup ID: ${setup.id}\nType: ${setup.type}\nClient: ${clientName}\n\nStep ${setup.current_step}/${steps.length}: ${currentStepName}`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('ClickUp updateTask error:', res.status, err)
    }
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