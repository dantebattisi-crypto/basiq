'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

export default function Setup2FAPage() {
  const [qrUrl, setQrUrl]     = useState(null)
  const [secret, setSecret]   = useState(null)
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  useEffect(() => {
    fetch('/api/auth/admin/setup-2fa')
      .then(r => r.json())
      .then(d => {
        setQrUrl(d.qrDataUrl)
        setSecret(d.secret)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function confirm(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/auth/admin/setup-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setDone(true)
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
        <h2 className="text-xl font-semibold text-[#f0ede8] mb-2">2FA enabled</h2>
        <p className="text-sm text-[#6a7a90] mb-8">
          Your account is now protected with two-factor authentication.
          You'll need your authenticator app on every login.
        </p>
        <Link href={`/${SEGMENT}/clients`} className="portal-btn-primary px-8 py-3 inline-block">
          Go to clients →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href={`/${SEGMENT}/clients`} className="text-[#6a7a90] hover:text-[#a8b8cc]">Clients</Link>
        <span className="text-[#344060]">/</span>
        <span className="text-[#f0ede8]">Set up 2FA</span>
      </div>

      <h1 className="text-2xl font-semibold text-[#f0ede8] mb-2">Two-factor authentication</h1>
      <p className="text-sm text-[#6a7a90] mb-8">
        Scan the QR code with Google Authenticator or Authy, then enter the 6-digit code to confirm.
      </p>

      {loading ? (
        <div className="portal-card text-center py-10 text-[#6a7a90] text-sm">Generating QR code…</div>
      ) : (
        <div className="portal-card space-y-6">
          {/* QR code */}
          {qrUrl && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl inline-block">
                <img src={qrUrl} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            </div>
          )}

          {/* Manual entry */}
          {secret && (
            <div className="bg-[#1e2d42] rounded-lg p-4">
              <p className="text-xs text-[#6a7a90] mb-1">Can't scan? Enter manually:</p>
              <p className="font-mono text-sm text-[#f0ede8] break-all">{secret}</p>
            </div>
          )}

          {/* Confirm */}
          <form onSubmit={confirm} className="space-y-4">
            <div>
              <label className="portal-label block mb-2">Enter the 6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="portal-input text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving || code.length < 6}
              className="w-full portal-btn-primary py-3 disabled:opacity-50"
            >
              {saving ? 'Verifying…' : 'Enable 2FA'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
