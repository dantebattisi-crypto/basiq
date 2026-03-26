'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

export default function Setup2FAPage() {
  const [qrUrl, setQrUrl]         = useState(null)
  const [secret, setSecret]       = useState(null)
  const [newCode, setNewCode]     = useState('')
  const [currentCode, setCurrentCode] = useState('')
  const [loading, setLoading]     = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)
  const [has2FA, setHas2FA]       = useState(false)

  // Check if 2FA is already enabled
  useEffect(() => {
    fetch('/api/auth/admin/2fa-status')
      .then(r => r.json())
      .then(d => setHas2FA(d.enabled))
      .catch(() => {})
  }, [])

  async function generateQR() {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/auth/admin/setup-2fa')
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setQrUrl(data.qrDataUrl)
      setSecret(data.secret)
    } catch {
      setError('Failed to generate QR code')
    } finally {
      setGenerating(false)
    }
  }

  async function confirm(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/admin/setup-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode, currentCode: has2FA ? currentCode : undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setDone(true)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
        <h2 className="text-xl font-semibold text-[#f0ede8] mb-2">2FA updated</h2>
        <p className="text-sm text-[#6a7a90] mb-8">
          Your authenticator app is now linked. Use it on every login.
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
        <span className="text-[#f0ede8]">{has2FA ? 'Change 2FA' : 'Set up 2FA'}</span>
      </div>

      <h1 className="text-2xl font-semibold text-[#f0ede8] mb-2">
        {has2FA ? 'Change two-factor authentication' : 'Set up two-factor authentication'}
      </h1>
      <p className="text-sm text-[#6a7a90] mb-8">
        {has2FA
          ? 'Confirm your current 2FA code, then scan the new QR code.'
          : 'Scan the QR code with your authenticator app, then enter the code to confirm.'}
      </p>

      <div className="portal-card space-y-6">

        {/* Step 1 — current code if 2FA enabled */}
        {has2FA && (
          <div>
            <label className="portal-label block mb-2">Current 2FA code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="portal-input text-center text-xl tracking-[0.4em] font-mono"
              placeholder="000000"
              value={currentCode}
              onChange={e => setCurrentCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        )}

        {/* Step 2 — generate QR */}
        {!qrUrl ? (
          <button
            onClick={generateQR}
            disabled={generating || (has2FA && currentCode.length < 6)}
            className="w-full portal-btn-primary py-3 disabled:opacity-50"
          >
            {generating ? 'Generating…' : has2FA ? 'Generate new QR code' : 'Generate QR code'}
          </button>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl inline-block">
                <img src={qrUrl} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            </div>

            {secret && (
              <div className="bg-[#1e2d42] rounded-lg p-4">
                <p className="text-xs text-[#6a7a90] mb-1">Can't scan? Enter manually:</p>
                <p className="font-mono text-sm text-[#f0ede8] break-all">{secret}</p>
              </div>
            )}

            <form onSubmit={confirm} className="space-y-4">
              <div>
                <label className="portal-label block mb-2">New authenticator code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="portal-input text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.replace(/\D/g, ''))}
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
                disabled={loading || newCode.length < 6}
                className="w-full portal-btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Verifying…' : has2FA ? 'Change 2FA' : 'Enable 2FA'}
              </button>
            </form>
          </>
        )}

        {error && !qrUrl && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}