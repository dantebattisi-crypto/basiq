import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getAdminSession } from '../../../../../lib/auth'
import { SETUP_TYPES, getSetupProgress } from '../../../../../lib/setups'
import SetupCard from '../../../../../components/admin/SetupCard'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

export default async function ClientDetailPage({ params }) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const { data: client } = await supabaseAdmin
    .from('clients')
    .select(`
      id, name, username, telegram, telegram_group, created_at, last_login,
      setups(id, type, current_step, action_step, status, start_date, est_date, notes, clickup_task_id, created_at, updated_at)
    `)
    .eq('id', (await params).id)
    .single()

  if (!client) notFound()

  const activeSetups = client.setups?.filter(s => s.status === 'active') || []
  const otherSetups  = client.setups?.filter(s => s.status !== 'active') || []

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href={`/${SEGMENT}/clients`} className="text-[#6a7a90] hover:text-[#a8b8cc] transition-colors">Clients</Link>
        <span className="text-[#344060]">/</span>
        <span className="text-[#f0ede8]">{client.name}</span>
      </div>

      {/* Client header */}
      <div className="portal-card mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f0ede8]">{client.name}</h1>
            <p className="text-[#6a7a90] text-sm font-mono mt-0.5">@{client.username}</p>
          </div>
          <Link
            href={`/${SEGMENT}/clients/${client.id}/setups/new`}
            className="portal-btn-primary text-sm"
          >
            + New setup
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Telegram', value: client.telegram || '—' },
            { label: 'Group', value: client.telegram_group ? 'Set' : '—' },
            { label: 'Created', value: new Date(client.created_at).toLocaleDateString('en-GB') },
            { label: 'Last login', value: client.last_login ? new Date(client.last_login).toLocaleDateString('en-GB') : 'Never' },
          ].map(item => (
            <div key={item.label} className="bg-[#1e2d42] rounded-lg p-3">
              <div className="portal-label mb-1">{item.label}</div>
              <div className="text-sm text-[#f0ede8] truncate">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active setups */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[#a8b8cc] uppercase tracking-wider mb-4">
          Active setups ({activeSetups.length})
        </h2>
        {activeSetups.length === 0 ? (
          <div className="portal-card text-center py-10">
            <p className="text-[#6a7a90] text-sm">No active setups.</p>
            <Link href={`/${SEGMENT}/clients/${client.id}/setups/new`} className="text-[#e8914a] text-sm mt-1 inline-block hover:underline">
              Create one →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeSetups.map(setup => (
              <SetupCard key={setup.id} setup={setup} clientId={client.id} />
            ))}
          </div>
        )}
      </div>

      {/* Other setups */}
      {otherSetups.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-[#6a7a90] uppercase tracking-wider mb-4">
            Past setups ({otherSetups.length})
          </h2>
          <div className="space-y-3">
            {otherSetups.map(setup => (
              <SetupCard key={setup.id} setup={setup} clientId={client.id} muted />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}