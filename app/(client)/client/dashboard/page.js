import { getClientSession } from '../../../../lib/auth'
import { supabaseAdmin } from '../../../../lib/supabase'
import { redirect } from 'next/navigation'
import { SETUP_TYPES, getSetupProgress } from '../../../../lib/setups'
import Link from 'next/link'

function ProgressRing({ pct }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#2c3d5e" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#e8914a" strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="36" y="41" textAnchor="middle" fill="#e8914a" fontSize="13" fontWeight="600" fontFamily="DM Mono">
        {pct}%
      </text>
    </svg>
  )
}

function statusBadge(status) {
  const map = {
    active:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    paused:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return map[status] || map.active
}

export default async function ClientDashboardPage() {
  const session = await getClientSession()
  if (!session) redirect(`/${process.env.NEXT_PUBLIC_CLIENT_LOGIN_SEGMENT || 'xk7p2q'}`)

  const { data: setups } = await supabaseAdmin
    .from('setups')
    .select('*')
    .eq('client_id', session.sub)
    .order('created_at', { ascending: false })

  const active    = setups?.filter(s => s.status === 'active') || []
  const completed = setups?.filter(s => s.status === 'completed') || []

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-10">
        <div>
          <p className="text-[#6a7a90] text-sm uppercase tracking-widest mb-2">Your portal</p>
          <h1 className="text-2xl sm:text-3xl font-light text-[#f0ede8]">
            Welcome, <span className="font-semibold">{session.name}</span>
          </h1>
        </div>
        <a
          href="https://shaded-feels-b1d.notion.site/All-setups-3377ce6d73468044bc94edbd6b682fb0?source=copy_link"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e8914a]/15 border border-[#e8914a]/40 text-[#e8914a] text-sm font-semibold hover:bg-[#e8914a]/25 hover:border-[#e8914a]/70 hover:shadow-lg hover:shadow-[#e8914a]/10 active:scale-95 transition-all duration-150"
        >
          Our Services
          <span className="text-base leading-none">→</span>
        </a>
      </div>

      {/* Active setups */}
      {active.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-medium text-[#a8b8cc] uppercase tracking-widest mb-4">
            Active setups
          </h2>
          <div className="grid gap-4">
            {active.map(setup => {
              const completedSteps = setup.completed_steps || []
              const activeSteps = setup.active_steps || []
              const steps = SETUP_TYPES[setup.type]?.steps || []
              const progress = getSetupProgress(setup.type, completedSteps)
              const activeNames = activeSteps.map(n => steps[n - 1]).filter(Boolean)

              return (
                <Link
                  key={setup.id}
                  href={`/client/setup/${setup.id}`}
                  className="portal-card w-full overflow-hidden flex items-center gap-3 sm:gap-5 hover:border-[#3e4e72] transition-all group"
                >
                  <div className="flex-shrink-0">
                    <ProgressRing pct={progress} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                      <h3 className="font-medium text-[#f0ede8] group-hover:text-[#e8914a] transition-colors leading-tight">
                        {SETUP_TYPES[setup.type]?.label || setup.type}
                      </h3>
                      {setup.action_step > 0 && (
                        <span className="text-xs bg-[#e8914a]/20 text-[#e8914a] px-2 py-0.5 rounded-full border border-[#e8914a]/30 whitespace-nowrap">
                          Action needed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6a7a90] truncate">
                      {completedSteps.length}/{steps.length} steps done
                    </p>
                    {activeNames.length > 0 && (
                      <p className="text-xs text-blue-400 truncate mt-0.5">
                        ▶ {activeNames.join(' · ')}
                      </p>
                    )}
                    {setup.est_date && (
                      <p className="text-xs text-[#344060] mt-1">
                        Est. {new Date(setup.est_date).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-[#344060] group-hover:text-[#e8914a] transition-colors text-lg">→</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-[#6a7a90] uppercase tracking-widest mb-4">
            Completed
          </h2>
          <div className="grid gap-3">
            {completed.map(setup => (
              <Link
                key={setup.id}
                href={`/client/setup/${setup.id}`}
                className="portal-card flex items-center justify-between opacity-60 hover:opacity-80 transition-opacity"
              >
                <div>
                  <p className="text-sm font-medium text-[#f0ede8]">{SETUP_TYPES[setup.type]?.label}</p>
                  <p className="text-xs text-[#6a7a90] mt-0.5">Completed</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                  Done
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!setups?.length && (
        <div className="portal-card text-center py-16">
          <p className="text-[#6a7a90]">Your setups will appear here once your manager creates them.</p>
          <p className="text-[#344060] text-sm mt-2">Contact your manager on Telegram if you have questions.</p>
        </div>
      )}
    </div>
  )
}
