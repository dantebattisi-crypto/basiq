'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  const [form, setForm] = useState({ email: '', password: '', code: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState(step === '2fa' ? '2fa' : 'credentials')

  async function handleCredentials(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        return
      }

      if (data.requires2FA) {
        setPhase('2fa')
      } else {
        router.push(`/${process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'}/clients`)
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handle2FA(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid code')
        return
      }

      router.push(`/${process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'}/clients`)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e2d42] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <div className="text-center">
            <p className="text-[#a8b8cc] text-sm mt-3">Admin Portal</p>
          </div>
        </div>

        <div className="bg-[#253450] border border-[#344060] rounded-2xl p-8">
          {phase === 'credentials' ? (
            <>
              <h1 className="text-xl font-semibold text-[#f0ede8] mb-1">Manager login</h1>
              <p className="text-sm text-[#6a7a90] mb-8">Access the BasiQ admin panel</p>

              <form onSubmit={handleCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#6a7a90] mb-2">Email</label>
                  <input
                    type="email"
                    className="portal-input"
                    placeholder="manager@basiq.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#6a7a90] mb-2">Password</label>
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
                  className="w-full bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/30 hover:bg-[#e8914a]/25 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Checking…' : 'Continue →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#e8914a]/15 flex items-center justify-center text-[#e8914a] text-lg">🔐</div>
                <div>
                  <h1 className="text-xl font-semibold text-[#f0ede8]">Two-factor auth</h1>
                  <p className="text-xs text-[#6a7a90]">Open your authenticator app</p>
                </div>
              </div>

              <p className="text-sm text-[#a8b8cc] mb-6">
                Enter the 6-digit code from Google Authenticator or Authy.
              </p>

              <form onSubmit={handle2FA} className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="portal-input text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.replace(/\D/g, '') }))}
                  required
                  autoFocus
                />

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || form.code.length < 6}
                  className="w-full bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/30 hover:bg-[#e8914a]/25 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying…' : 'Verify & Login'}
                </button>

                <button
                  type="button"
                  onClick={() => { setPhase('credentials'); setError('') }}
                  className="w-full text-[#6a7a90] hover:text-[#a8b8cc] py-2 text-sm transition-colors"
                >
                  ← Back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
