'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ClientLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        return
      }

      router.push('/client/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e2d42] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="text-center">
            <p className="text-[#a8b8cc] text-sm mt-3">Client Portal</p>
          </div>
        </div>

        <div className="bg-[#253450] border border-[#344060] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-[#f0ede8] mb-1">Welcome back</h1>
          <p className="text-sm text-[#6a7a90] mb-8">Sign in to view your setup status</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#6a7a90] mb-2">
                Username
              </label>
              <input
                type="text"
                className="portal-input"
                placeholder="your_username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#6a7a90] mb-2">
                Password
              </label>
              <input
                type="password"
                className="portal-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/30 hover:bg-[#e8914a]/25 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#344060] mt-8">
          Having trouble? Contact your manager on Telegram.
        </p>
      </div>
    </div>
  )
}
