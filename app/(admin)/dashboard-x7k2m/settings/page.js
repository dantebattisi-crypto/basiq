'use client'
import { useState, useEffect } from 'react'

const FIELDS = [
  { key: 'notion_onboarding', label: 'Onboarding checklist', icon: '✅', desc: 'Step-by-step from start to first sale' },
  { key: 'notion_proxy',      label: 'Proxy guide',          icon: '🌍', desc: 'GonzoProxy + OctoBrowser setup' },
  { key: 'notion_warmup',     label: 'Warm-up SOP',          icon: '🔥', desc: 'Stripe / PayPal / SP rules' },
  { key: 'notion_policy',     label: 'Service policy',       icon: '📋', desc: 'Refunds, replacements, timelines' },
]

export default function SettingsPage() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        setValues(d.settings || {})
        setLoading(false)
      })
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-[#6a7a90] text-sm">Loading…</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#f0ede8]">Settings</h1>
        <p className="text-sm text-[#6a7a90] mt-1">Notion guide links shown to all clients</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="portal-card space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6a7a90]">Notion links</h2>

          {FIELDS.map(field => (
            <div key={field.key}>
              <label className="flex items-center gap-2 portal-label mb-2">
                <span>{field.icon}</span>
                <span>{field.label}</span>
                <span className="normal-case font-normal text-[#344060]">— {field.desc}</span>
              </label>
              <input
                type="url"
                className="portal-input font-mono text-xs"
                placeholder="https://notion.so/..."
                value={values[field.key] || ''}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
              />
            </div>
          ))}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {saved && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400">
              Saved ✓ — all clients will see the updated links immediately
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="portal-btn-primary w-full sm:w-auto disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
