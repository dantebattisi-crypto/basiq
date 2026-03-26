'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { SETUP_TYPES, getSetupProgress } from '../../../../../../lib/setups'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

const STATUS_OPTIONS = ['active', 'completed', 'paused', 'cancelled']

function statusColor(status) {
  const map = {
    active:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
    completed: 'text-green-400 bg-green-500/10 border-green-500/20',
    paused:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  }
  return map[status] || map.active
}

export default function SetupEditPage() {
  const params = useParams()
  const router = useRouter()
  const { id: clientId, setupId } = params

  const [setup, setSetup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState('')
  const [estDate, setEstDate] = useState('')

  useEffect(() => {
    fetch(`/api/admin/clients/${clientId}/setups/${setupId}`)
      .then(r => r.json())
      .then(d => {
        setSetup(d.setup)
        setNotes(d.setup?.notes || '')
        setEstDate(d.setup?.est_date || '')
        setLoading(false)
      })
  }, [clientId, setupId])

  async function update(patch) {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/setups/${setupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSetup(data.setup)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-[#6a7a90] text-sm">Loading…</div>
  }

  if (!setup) {
    return <div className="text-red-400 text-sm">Setup not found.</div>
  }

  const steps = SETUP_TYPES[setup.type]?.steps || []
  const progress = getSetupProgress(setup.type, setup.current_step)

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href={`/${SEGMENT}/clients`} className="text-[#6a7a90] hover:text-[#a8b8cc]">Clients</Link>
        <span className="text-[#344060]">/</span>
        <Link href={`/${SEGMENT}/clients/${clientId}`} className="text-[#6a7a90] hover:text-[#a8b8cc]">Client</Link>
        <span className="text-[#344060]">/</span>
        <span className="text-[#f0ede8]">{SETUP_TYPES[setup.type]?.label}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f0ede8]">{SETUP_TYPES[setup.type]?.label}</h1>
          <p className="text-sm text-[#6a7a90] mt-1">
            Started {setup.start_date ? new Date(setup.start_date).toLocaleDateString('en-GB') : '—'}
          </p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${statusColor(setup.status)}`}>
          {setup.status}
        </span>
      </div>

      {/* Progress */}
      <div className="portal-card mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[#a8b8cc]">Progress</h2>
          <span className="text-[#e8914a] font-mono text-sm">{progress}%</span>
        </div>
        <div className="h-1.5 bg-[#1e2d42] rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-[#e8914a] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((label, i) => {
            const n = i + 1
            const isDone    = n < setup.current_step
            const isActive  = n === setup.current_step
            const isAction  = n === setup.action_step
            const isPending = !isDone && !isActive

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isDone   ? 'bg-green-900/20 border-green-500/15' :
                  isAction ? 'bg-[#e8914a]/15 border-[#e8914a]/40' :
                  isActive ? 'bg-[#e8914a]/08 border-[#e8914a]/20' :
                  'bg-transparent border-transparent'
                }`}
              >
                {/* Step indicator */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  isDone   ? 'bg-green-700/50 text-green-300' :
                  isAction ? 'bg-[#e8914a]/30 text-[#e8914a] border border-[#e8914a]' :
                  isActive ? 'bg-[#e8914a]/20 text-[#e8914a] border border-[#e8914a]/50' :
                  'bg-[#2c3d5e] text-[#6a7a90]'
                }`}>
                  {isDone ? '✓' : n}
                </div>

                <span className={`text-sm flex-1 ${
                  isDone    ? 'text-[#6a7a90] line-through' :
                  isAction  ? 'text-[#e8914a] font-medium' :
                  isActive  ? 'text-[#f0ede8] font-medium' :
                  'text-[#6a7a90]'
                }`}>
                  {label}
                  {isAction && <span className="ml-2 text-xs bg-[#e8914a]/20 text-[#e8914a] px-1.5 py-0.5 rounded">action needed</span>}
                </span>

                {/* Controls */}
                <div className="flex gap-1.5 flex-shrink-0">
                  {!isDone && n !== setup.current_step && (
                    <button
                      onClick={() => update({ current_step: n })}
                      className="text-xs text-[#6a7a90] hover:text-[#e8914a] px-2 py-1 rounded hover:bg-[#e8914a]/10 transition-all"
                    >
                      Set active
                    </button>
                  )}
                  {setup.action_step === n ? (
                    <button
                      onClick={() => update({ action_step: 0 })}
                      className="text-xs text-[#e8914a] px-2 py-1 rounded bg-[#e8914a]/10 hover:bg-[#e8914a]/20 transition-all"
                    >
                      Clear action
                    </button>
                  ) : !isDone && (
                    <button
                      onClick={() => update({ action_step: n })}
                      className="text-xs text-[#6a7a90] hover:text-[#e8914a] px-2 py-1 rounded hover:bg-[#e8914a]/10 transition-all"
                    >
                      ! Action
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick nav */}
        <div className="flex gap-2 mt-5 pt-5 border-t border-[#344060]">
          <button
            disabled={setup.current_step <= 1}
            onClick={() => update({ current_step: setup.current_step - 1 })}
            className="portal-btn-ghost text-xs disabled:opacity-30"
          >
            ← Previous step
          </button>
          <button
            disabled={setup.current_step >= steps.length}
            onClick={() => update({ current_step: setup.current_step + 1 })}
            className="portal-btn-primary text-xs disabled:opacity-30"
          >
            Next step →
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="portal-card space-y-4">
        <h2 className="text-sm font-medium text-[#a8b8cc]">Settings</h2>

        <div>
          <label className="portal-label block mb-2">Status</label>
          <select
            className="portal-input max-w-xs"
            value={setup.status}
            onChange={e => update({ status: e.target.value })}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="portal-label block mb-2">Est. completion</label>
          <input
            type="date"
            className="portal-input max-w-xs"
            value={estDate}
            onChange={e => setEstDate(e.target.value)}
            onBlur={() => update({ est_date: estDate })}
          />
        </div>

        <div>
          <label className="portal-label block mb-2">Internal notes</label>
          <textarea
            className="portal-input min-h-[90px] resize-none"
            placeholder="Notes visible only to admins…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={() => update({ notes })}
          />
        </div>

        {setup.clickup_task_id && (
          <div>
            <label className="portal-label block mb-1">ClickUp task</label>
            <a
              href={`https://app.clickup.com/t/${setup.clickup_task_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#e8914a] hover:underline font-mono"
            >
              {setup.clickup_task_id} ↗
            </a>
          </div>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {saved && (
        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400">
          Saved ✓
        </div>
      )}
      {saving && (
        <div className="mt-4 text-sm text-[#6a7a90]">Saving…</div>
      )}
    </div>
  )
}
