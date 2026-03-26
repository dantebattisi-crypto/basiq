'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function NewClientPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: generatePassword(),
    telegram: '',
    telegram_group: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  function set(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create client')
        return
      }

      setCreated({ ...data.client, password: form.password })
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (created) {
    return (
      <div className="max-w-lg">
        <div className="portal-card border-green-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center text-green-400 text-xl">✓</div>
            <div>
              <h2 className="text-lg font-semibold text-[#f0ede8]">Client created</h2>
              <p className="text-sm text-[#6a7a90]">Share these credentials with your client</p>
            </div>
          </div>

          <div className="bg-[#1e2d42] rounded-xl p-4 space-y-3 font-mono text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-[#6a7a90]">Login URL</span>
              <span className="text-[#e8914a]">{window.location.origin}/login</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6a7a90]">Username</span>
              <span className="text-[#f0ede8]">{created.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6a7a90]">Password</span>
              <span className="text-[#f0ede8]">{created.password}</span>
            </div>
          </div>

          <p className="text-xs text-[#6a7a90] mb-6">
            ⚠️ Save these credentials now — the password cannot be recovered later.
          </p>

          <div className="flex gap-3">
            <Link
              href={`/${SEGMENT}/clients/${created.id}`}
              className="portal-btn-primary flex-1 text-center"
            >
              Add a setup →
            </Link>
            <Link
              href={`/${SEGMENT}/clients`}
              className="portal-btn-ghost flex-1 text-center"
            >
              Back to clients
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/${SEGMENT}/clients`} className="text-[#6a7a90] hover:text-[#a8b8cc] transition-colors text-sm">
          ← Clients
        </Link>
        <span className="text-[#344060]">/</span>
        <span className="text-[#f0ede8] text-sm">New client</span>
      </div>

      <h1 className="text-2xl font-semibold text-[#f0ede8] mb-8">Create client</h1>

      <form onSubmit={handleSubmit} className="portal-card space-y-5">
        <div>
          <label className="portal-label block mb-2">Full name</label>
          <input className="portal-input" placeholder="John Smith" value={form.name} onChange={set('name')} required />
        </div>

        <div>
          <label className="portal-label block mb-2">Username</label>
          <input
            className="portal-input font-mono"
            placeholder="john_smith"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
            required
          />
          <p className="text-xs text-[#6a7a90] mt-1.5">Lowercase letters, numbers, underscores only</p>
        </div>

        <div>
          <label className="portal-label block mb-2">Password</label>
          <div className="flex gap-2">
            <input className="portal-input font-mono flex-1" value={form.password} onChange={set('password')} required />
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, password: generatePassword() }))}
              className="portal-btn-ghost px-3 text-xs"
            >
              ↺ Generate
            </button>
          </div>
        </div>

        <div>
          <label className="portal-label block mb-2">Telegram (optional)</label>
          <input className="portal-input" placeholder="@username" value={form.telegram} onChange={set('telegram')} />
        </div>

        <div>
          <label className="portal-label block mb-2">Client Telegram group (optional)</label>
          <input className="portal-input" placeholder="https://t.me/..." value={form.telegram_group} onChange={set('telegram_group')} />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="portal-btn-primary flex-1 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create client'}
          </button>
          <Link href={`/${SEGMENT}/clients`} className="portal-btn-ghost flex-1 text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
