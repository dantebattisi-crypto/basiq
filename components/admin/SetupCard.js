import Link from 'next/link'
import { SETUP_TYPES, getSetupProgress } from '../../lib/setups'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

function statusColor(status) {
  const map = {
    active:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
    completed: 'text-green-400 bg-green-500/10 border-green-500/20',
    paused:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  }
  return map[status] || map.active
}

export default function SetupCard({ setup, clientId, muted = false }) {
  const steps = SETUP_TYPES[setup.type]?.steps || []
  const progress = getSetupProgress(setup.type, setup.current_step)
  const currentStepName = steps[setup.current_step - 1] || '—'

  return (
    <div className={`portal-card ${muted ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium text-[#f0ede8]">{SETUP_TYPES[setup.type]?.label || setup.type}</h3>
          <p className="text-xs text-[#6a7a90] mt-0.5">
            Step {setup.current_step}/{steps.length} — {currentStepName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColor(setup.status)}`}>
            {setup.status}
          </span>
          <Link
            href={`/${SEGMENT}/clients/${clientId}/setups/${setup.id}`}
            className="text-xs text-[#e8914a] hover:underline"
          >
            Edit →
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#1e2d42] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e8914a] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-[#e8914a] font-mono w-8 text-right">{progress}%</span>
      </div>

      {setup.est_date && (
        <p className="text-xs text-[#6a7a90] mt-3">
          Est. completion: {new Date(setup.est_date).toLocaleDateString('en-GB')}
        </p>
      )}

      {setup.action_step > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#e8914a]">
          <span>⚠</span>
          <span>Action needed at step {setup.action_step}: {steps[setup.action_step - 1]}</span>
        </div>
      )}
    </div>
  )
}
