import { supabaseAdmin } from './supabase'

const MAX_ATTEMPTS = 5
const WINDOW_MINUTES = 15

export async function checkRateLimit(identifier, ip) {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()

  const { data, error } = await supabaseAdmin
    .from('login_attempts')
    .select('id, success')
    .eq('identifier', identifier)
    .gte('created_at', windowStart)
    .order('created_at', { ascending: false })

  if (error) return { allowed: true }

  const failedAttempts = data.filter(a => !a.success).length

  return {
    allowed: failedAttempts < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - failedAttempts),
    resetAt: new Date(Date.now() + WINDOW_MINUTES * 60 * 1000),
  }
}

export async function recordAttempt(identifier, ip, success) {
  await supabaseAdmin.from('login_attempts').insert({
    identifier,
    ip_address: ip,
    success,
  })
}
