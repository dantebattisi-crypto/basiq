import axios from 'axios'
import { SETUP_TYPES } from './setups'

const CU = axios.create({
  baseURL: 'https://api.clickup.com/api/v2',
  headers: { Authorization: process.env.CLICKUP_API_TOKEN },
})

const LIST_ID = process.env.CLICKUP_LIST_ID

// Map our step number to ClickUp status
function stepToStatus(type, step) {
  const steps = SETUP_TYPES[type]?.steps || []
  const total = steps.length
  if (step >= total) return 'complete'
  if (step === 1) return 'to do'
  return 'in progress'
}

// Create a new ClickUp task when setup is created
export async function createClickUpTask(setup, clientName) {
  try {
    const { data } = await CU.post(`/list/${LIST_ID}/task`, {
      name: `${clientName} — ${SETUP_TYPES[setup.type]?.label || setup.type}`,
      description: `Setup ID: ${setup.id}\nType: ${setup.type}\nClient: ${clientName}`,
      status: 'to do',
      custom_fields: [
        { name: 'Setup ID', value: setup.id },
        { name: 'Setup Type', value: setup.type },
      ],
    })
    return data.id
  } catch (err) {
    console.error('ClickUp createTask error:', err.message)
    return null
  }
}

// Update ClickUp task when step changes
export async function updateClickUpTask(taskId, setup, clientName) {
  if (!taskId) return
  try {
    const steps = SETUP_TYPES[setup.type]?.steps || []
    const currentStepName = steps[setup.current_step - 1] || 'Unknown'

    await CU.put(`/task/${taskId}`, {
      status: stepToStatus(setup.type, setup.current_step),
      description: `Setup ID: ${setup.id}\nType: ${setup.type}\nClient: ${clientName}\n\nCurrent step (${setup.current_step}/${steps.length}): ${currentStepName}`,
    })
  } catch (err) {
    console.error('ClickUp updateTask error:', err.message)
  }
}

// Get ClickUp task status (for sync FROM ClickUp)
export async function getClickUpTask(taskId) {
  if (!taskId) return null
  try {
    const { data } = await CU.get(`/task/${taskId}`)
    return data
  } catch (err) {
    console.error('ClickUp getTask error:', err.message)
    return null
  }
}

// Verify ClickUp webhook signature
export function verifyWebhookSignature(body, signature) {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', process.env.CLICKUP_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex')
  return expected === signature
}
