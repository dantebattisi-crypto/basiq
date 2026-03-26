'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { SETUP_TYPES } from '../../../../../../lib/setups'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

export default function NewSetupPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id

  const [form, setForm] = useState({
    type: 'HK+Bank',
    start_date: new Date().toISOString().split('T')[0],
    est_date: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/setups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create setup')
        return
      }

      router.push(`/${SEGMENT}/clients/${clientId}`)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const selectedSteps = SETUP_TYPES[form.type]?.steps || []

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href={`/${SEGMENT}/clients`} className="text-[#6a7a90] hover:text-[#a8b8cc]">Clients</Link>
        <span className="text-[#344060]">/</span>
        <Link href={`/${SEGMENT}/clients/${clientId}`} className="text-[#6a7a90] hover:text-[#a8b8cc]">Client</Link>
        <span className="text-[#344060]">/</span>
        <span className="text-[#f0ede8]">New setup</span>
      </div>

      <h1 className="text-2xl font-semibold text-[#f0ede8] mb-8">Create setup</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="portal-card">
          <h2 className="text-sm font-medium text-[#a8b8cc] mb-5">Setup details</h2>

          <div className="space-y-4">
            <div>
              <label className="portal-label block mb-2">Setup type</label>
              <select className="portal-input" value={form.type} onChange={set('type')}>
                {Object.entries(SETUP_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="portal-label block mb-2">Start date</label>
                <input type="date" className="portal-input" value={form.start_date} onChange={set('start_date')} />
              </div>
              <div>
                <label className="portal-label block mb-2">Est. completion</label>
                <input type="date" className="portal-input" value={form.est_date} onChange={set('est_date')} />
              </div>
            </div>

            <div>
              <label className="portal-label block mb-2">Notes (internal)</label>
              <textarea
                className="portal-input min-h-[80px] resize-none"
                placeholder="Any notes about this setup…"
                value={form.notes}
                onChange={set('notes')}
              />
            </div>
          </div>
        </div>

        {/* Steps preview */}
        <div className="portal-card">
          <h2 className="text-sm font-medium text-[#a8b8cc] mb-4">
            Steps preview — {selectedSteps.length} steps
          </h2>
          <ol className="space-y-2">
            {selectedSteps.map((step, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#a8b8cc]">
                <span className="w-6 h-6 rounded-full bg-[#2c3d5e] border border-[#344060] flex items-center justify-center text-xs text-[#6a7a90] flex-shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="portal-btn-primary flex-1 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create setup'}
          </button>
          <Link href={`/${SEGMENT}/clients/${clientId}`} className="portal-btn-ghost flex-1 text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
