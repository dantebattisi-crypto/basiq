import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getClientSession } from '../../../../../lib/auth'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { SETUP_TYPES, NOTION_LINKS, getSetupProgress } from '../../../../../lib/setups'

export default async function ClientSetupPage({ params }) {
  const session = await getClientSession()
  if (!session) redirect('/login')

  const { data: setup } = await supabaseAdmin
    .from('setups')
    .select('*')
    .eq('id', params.id)
    .eq('client_id', session.sub)
    .single()

  if (!setup) notFound()

  const steps = SETUP_TYPES[setup.type]?.steps || []
  const progress = getSetupProgress(setup.type, setup.current_step)

  // Get client info for contacts
  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('telegram, telegram_group')
    .eq('id', session.sub)
    .single()

  const guides = [
    { icon: '✅', title: 'Onboarding checklist', desc: 'Step-by-step from start to first sale', url: NOTION_LINKS.onboarding },
    { icon: '🌍', title: 'Proxy guide', desc: 'GonzoProxy + OctoBrowser setup', url: NOTION_LINKS.proxy },
    { icon: '🔥', title: 'Warm-up SOP', desc: 'Stripe / PayPal / SP rules', url: NOTION_LINKS.warmup },
    { icon: '📋', title: 'Service policy', desc: 'Refunds, replacements, timelines', url: NOTION_LINKS.policy },
  ]

  return (
    <div>
      {/* Back */}
      <Link href="/client/dashboard" className="text-[#6a7a90] hover:text-[#a8b8cc] text-sm transition-colors mb-8 inline-block">
        ← All setups
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-[#6a7a90] text-xs uppercase tracking-widest mb-2">
          {SETUP_TYPES[setup.type]?.label}
        </p>
        <h1 className="text-2xl font-semibold text-[#f0ede8] mb-1">Setup status</h1>
        {setup.start_date && (
          <p className="text-sm text-[#6a7a90]">
            Started {new Date(setup.start_date).toLocaleDateString('en-GB')}
            {setup.est_date && ` · Est. ${new Date(setup.est_date).toLocaleDateString('en-GB')}`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: progress */}
        <div className="lg:col-span-2 space-y-5">

          {/* Progress card */}
          <div className="portal-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-[#a8b8cc] uppercase tracking-wider">Progress</h2>
              <span className="text-[#e8914a] font-mono text-sm">{progress}%</span>
            </div>
            <div className="h-1.5 bg-[#1e2d42] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-[#e8914a] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-2">
              {steps.map((label, i) => {
                const n = i + 1
                const isDone   = n < setup.current_step
                const isActive = n === setup.current_step
                const isAction = n === setup.action_step

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isDone   ? 'bg-green-900/15 border-green-500/10' :
                      isAction ? 'bg-[#e8914a]/12 border-[#e8914a]/35' :
                      isActive ? 'bg-[#e8914a]/07 border-[#e8914a]/18' :
                      'bg-transparent border-transparent'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      isDone   ? 'bg-green-800/50 text-green-400' :
                      isAction ? 'bg-[#e8914a]/25 text-[#e8914a] border border-[#e8914a]' :
                      isActive ? 'bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/40' :
                      'bg-[#2c3d5e] text-[#6a7a90]'
                    }`}>
                      {isDone ? '✓' : n}
                    </div>

                    <span className={`text-sm flex-1 ${
                      isDone   ? 'text-[#6a7a90] line-through' :
                      isAction ? 'text-[#e8914a] font-medium' :
                      isActive ? 'text-[#f0ede8] font-medium' :
                      'text-[#6a7a90]'
                    }`}>
                      {label}
                    </span>

                    {isAction && (
                      <span className="text-xs bg-[#e8914a]/20 text-[#e8914a] px-2 py-0.5 rounded-full border border-[#e8914a]/30 flex-shrink-0">
                        Action needed
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-5 pt-4 border-t border-[#344060] flex-wrap">
              {[
                { dot: 'bg-green-500', label: 'Done' },
                { dot: 'bg-[#e8914a]', label: 'In progress' },
                { dot: 'bg-[#e8914a] opacity-50', label: 'Action needed' },
                { dot: 'bg-[#344060]', label: 'Pending' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-[#6a7a90]">
                  <div className={`w-2 h-2 rounded-full ${l.dot}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Key rules */}
          <div className="portal-card">
            <h2 className="text-xs font-medium text-[#6a7a90] uppercase tracking-wider mb-4">Key rules</h2>
            {[
              'Never use your personal phone number for any service',
              'Always use OctoBrowser + proxy — never your regular browser',
              'Do not use Dolphin Anty — use OctoBrowser only',
              'Do not make any changes to accounts unless your manager instructs you',
              'Update all credentials to your own within 3 weeks of receiving access',
            ].map((rule, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-[#2c3d5e] last:border-0 text-xs text-[#6a7a90]">
                <span className="text-[#e8914a]/50 font-mono">{String(i+1).padStart(2,'0')}</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: guides + contacts */}
        <div className="space-y-4">
          {/* Guides */}
          <div className="portal-card">
            <h2 className="text-xs font-medium text-[#6a7a90] uppercase tracking-wider mb-4">Guides</h2>
            <div className="space-y-2">
              {guides.map(g => (
                <a
                  key={g.title}
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-[#1e2d42] rounded-lg hover:bg-[#2c3d5e] transition-colors group"
                >
                  <span className="text-lg flex-shrink-0">{g.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#f0ede8] group-hover:text-[#e8914a] transition-colors">{g.title}</p>
                    <p className="text-xs text-[#6a7a90] mt-0.5">{g.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="portal-card">
            <h2 className="text-xs font-medium text-[#6a7a90] uppercase tracking-wider mb-4">Contacts</h2>
            <div className="space-y-2">
              {client?.telegram && (
                <a
                  href={`https://t.me/${client.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#1e2d42] rounded-lg hover:bg-[#2c3d5e] transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#e8914a] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[#6a7a90]">Your manager</p>
                    <p className="text-sm font-medium text-[#e8914a]">{client.telegram}</p>
                  </div>
                </a>
              )}
              {client?.telegram_group && (
                <a
                  href={client.telegram_group}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#1e2d42] rounded-lg hover:bg-[#2c3d5e] transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#e8914a] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[#6a7a90]">Your group</p>
                    <p className="text-sm font-medium text-[#e8914a]">Open group →</p>
                  </div>
                </a>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#2c3d5e] text-xs text-[#6a7a90] leading-relaxed">
              <strong className="text-[#a8b8cc]">Support hours:</strong><br />
              Mon–Fri 10:00–18:00 · Weekends 10:00–14:00 (UK time)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
