'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { SETUP_TYPES, getSetupProgress } from '../../../../lib/setups'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

const STATUS_CONFIG = {
  active: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  paused: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

function deadlineBadge(estDate) {
  if (!estDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(estDate)
  const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

  if (days < 0)  return { label: `${Math.abs(days)}d overdue`, color: 'text-red-400 bg-red-500/10 border-red-500/30' }
  if (days === 0) return { label: 'Due today',   color: 'text-red-400 bg-red-500/10 border-red-500/30' }
  if (days <= 3)  return { label: `${days}d left`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
  if (days <= 7)  return { label: `${days}d left`, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' }
  return { label: `${days}d left`, color: 'text-[#6a7a90] bg-transparent border-[#2c3d5e]' }
}

function SetupRow({ setup, onUpdated }) {
  const [editingIssue, setEditingIssue] = useState(false)
  const [issueNote, setIssueNote] = useState(setup.issue_note || '')
  const [saving, setSaving] = useState(false)

  const progress = getSetupProgress(setup.type, setup.completed_steps || [])
  const hasIssue = !!(setup.issue_note?.trim())
  const badge = deadlineBadge(setup.est_date)
  const totalSteps = SETUP_TYPES[setup.type]?.steps?.length || 1
  const completedCount = (setup.completed_steps || []).length

  async function saveIssue() {
    setSaving(true)
    await fetch(`/api/admin/clients/${setup.client_id}/setups/${setup.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issue_note: issueNote.trim() }),
    })
    setSaving(false)
    setEditingIssue(false)
    onUpdated()
  }

  async function clearIssue() {
    setSaving(true)
    await fetch(`/api/admin/clients/${setup.client_id}/setups/${setup.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issue_note: '' }),
    })
    setSaving(false)
    setIssueNote('')
    onUpdated()
  }

  return (
    <div className={`portal-card transition-all ${hasIssue ? 'border-red-500/30' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">

        {/* Left: client + type + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/${SEGMENT}/clients/${setup.client_id}/setups/${setup.id}`}
              className="font-medium text-[#f0ede8] hover:text-[#e8914a] transition-colors"
            >
              {setup.clients?.name || setup.clients?.username || 'Unknown'}
            </Link>
            <span className="text-[#344060] text-xs">·</span>
            <span className="text-sm text-[#a8b8cc]">{SETUP_TYPES[setup.type]?.label || setup.type}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_CONFIG[setup.status] || ''}`}>
              {setup.status}
            </span>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#1e2d42] rounded-full overflow-hidden max-w-[180px]">
              <div
                className="h-full bg-[#e8914a] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#6a7a90] tabular-nums">{completedCount}/{totalSteps} steps</span>
          </div>

          {/* Dates */}
          <div className="flex gap-3 mt-1.5 text-xs text-[#6a7a90] flex-wrap">
            {setup.start_date && (
              <span>Started {new Date(setup.start_date).toLocaleDateString('en-GB')}</span>
            )}
            {setup.est_date && (
              <span>Est. {new Date(setup.est_date).toLocaleDateString('en-GB')}</span>
            )}
          </div>

          {/* Issue note display */}
          {hasIssue && !editingIssue && (
            <div
              className="mt-2 flex items-start gap-1.5 cursor-pointer group"
              onClick={() => setEditingIssue(true)}
            >
              <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">⚠</span>
              <p className="text-xs text-red-300/80 group-hover:text-red-300 transition-colors leading-snug">
                {setup.issue_note}
              </p>
            </div>
          )}

          {/* Issue edit inline */}
          {editingIssue && (
            <div className="mt-2 flex gap-2">
              <input
                autoFocus
                type="text"
                value={issueNote}
                onChange={e => setIssueNote(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveIssue()
                  if (e.key === 'Escape') { setIssueNote(setup.issue_note || ''); setEditingIssue(false) }
                }}
                placeholder="Describe the issue…"
                className="portal-input flex-1 text-xs py-1.5"
              />
              <button
                onClick={saveIssue}
                disabled={saving}
                className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => { setIssueNote(setup.issue_note || ''); setEditingIssue(false) }}
                className="px-3 py-1.5 text-[#6a7a90] rounded text-xs hover:text-[#a8b8cc] transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">

          {/* Issue flag button */}
          <button
            onClick={() => { setIssueNote(setup.issue_note || ''); setEditingIssue(true) }}
            title={hasIssue ? 'Edit issue note' : 'Flag an issue'}
            className={`text-xs px-2.5 py-1 rounded border transition-all ${
              hasIssue
                ? 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                : 'text-[#6a7a90] bg-transparent border-[#2c3d5e] hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10'
            }`}
          >
            {hasIssue ? '⚠ Issue' : '+ Issue'}
          </button>

          {/* Clear issue */}
          {hasIssue && !editingIssue && (
            <button
              onClick={clearIssue}
              title="Clear issue"
              className="text-xs text-[#6a7a90] hover:text-[#a8b8cc] transition-colors px-1"
            >
              ✕
            </button>
          )}

          {/* Edit link */}
          <Link
            href={`/${SEGMENT}/clients/${setup.client_id}/setups/${setup.id}`}
            className="text-xs text-[#6a7a90] hover:text-[#e8914a] transition-colors px-2 py-1 rounded hover:bg-[#e8914a]/10"
          >
            Edit →
          </Link>
        </div>
      </div>
    </div>
  )
}

function sortByDeadline(a, b) {
  const BIG = 9999999
  const daysLeft = s => {
    if (!s.est_date) return BIG
    const today = new Date(); today.setHours(0,0,0,0)
    return Math.ceil((new Date(s.est_date) - today) / (1000 * 60 * 60 * 24))
  }
  return daysLeft(a) - daysLeft(b)
}

export default function SetupsPage() {
  const [setups, setSetups] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | issues | overdue
  const [sort, setSort] = useState('deadline') // deadline | progress | created

  const load = useCallback(() => {
    fetch('/api/admin/setups')
      .then(r => r.json())
      .then(d => { setSetups(d.setups || []); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const today = new Date(); today.setHours(0,0,0,0)

  const filtered = setups.filter(s => {
    if (filter === 'issues') return !!(s.issue_note?.trim())
    if (filter === 'overdue') return s.est_date && new Date(s.est_date) < today
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'deadline') return sortByDeadline(a, b)
    if (sort === 'progress') {
      const pa = getSetupProgress(a.type, a.completed_steps || [])
      const pb = getSetupProgress(b.type, b.completed_steps || [])
      return pa - pb
    }
    if (sort === 'created') return new Date(a.created_at) - new Date(b.created_at)
    return 0
  })

  const issueCount   = setups.filter(s => s.issue_note?.trim()).length
  const overdueCount = setups.filter(s => s.est_date && new Date(s.est_date) < today).length

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#f0ede8]">Active Setups</h1>
          <p className="text-sm text-[#6a7a90] mt-0.5">
            {setups.length} setup{setups.length !== 1 ? 's' : ''} in progress
            {issueCount > 0 && <span className="ml-2 text-red-400">· {issueCount} with issues</span>}
            {overdueCount > 0 && <span className="ml-2 text-amber-400">· {overdueCount} overdue</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter */}
          <div className="flex items-center gap-1 bg-[#1a2538] border border-[#2c3d5e] rounded-lg p-1">
            {[
              { key: 'all',     label: 'All' },
              { key: 'issues',  label: `Issues${issueCount ? ` (${issueCount})` : ''}` },
              { key: 'overdue', label: `Overdue${overdueCount ? ` (${overdueCount})` : ''}` },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  filter === f.key
                    ? 'bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/20'
                    : 'text-[#6a7a90] hover:text-[#a8b8cc]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-[#1a2538] border border-[#2c3d5e] text-[#a8b8cc] cursor-pointer"
          >
            <option value="deadline">Sort: By deadline</option>
            <option value="progress">Sort: Least progress</option>
            <option value="created">Sort: Oldest first</option>
          </select>

          <button
            onClick={load}
            className="text-xs px-3 py-2 rounded-lg bg-[#1a2538] border border-[#2c3d5e] text-[#6a7a90] hover:text-[#a8b8cc] transition-colors"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-[#6a7a90] text-sm">Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="portal-card text-center py-10">
          <p className="text-[#6a7a90] text-sm">
            {filter !== 'all' ? 'No setups match the current filter.' : 'No active setups.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(setup => (
            <SetupRow key={setup.id} setup={setup} onUpdated={load} />
          ))}
        </div>
      )}
    </div>
  )
}
