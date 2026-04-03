import Link from 'next/link'
import { supabaseAdmin } from '../../../../lib/supabase'
import { getAdminSession } from '../../../../lib/auth'
import { redirect } from 'next/navigation'
import { SETUP_TYPES } from '../../../../lib/setups'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

function statusBadge(status) {
  const map = {
    active:    'bg-blue-500/15 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/15 text-green-400 border-green-500/20',
    paused:    'bg-amber-500/15 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  return map[status] || map.active
}

export default async function AdminClientsPage({ searchParams }) {
  const session = await getAdminSession()
  if (!session) redirect(`/${process.env.NEXT_PUBLIC_ADMIN_LOGIN_SEGMENT || 'n3r8v5'}`)

  const params = await searchParams
  const search = params?.search || ''

  let query = supabaseAdmin
    .from('clients')
    .select(`id, name, username, telegram, created_at, last_login, setups(id, type, current_step, status)`)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  const { data: clients } = await query

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f0ede8]">Clients</h1>
          <p className="text-sm text-[#6a7a90] mt-1">{clients?.length || 0} total</p>
        </div>
        <Link
          href={`/${SEGMENT}/clients/new`}
          className="bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/30 hover:bg-[#e8914a]/25 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          + New client
        </Link>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or username…"
          className="portal-input max-w-sm"
        />
      </form>

      {/* Table */}
      {!clients?.length ? (
        <div className="portal-card text-center py-16">
          <p className="text-[#6a7a90] text-sm">No clients yet.</p>
          <Link href={`/${SEGMENT}/clients/new`} className="text-[#e8914a] text-sm mt-2 inline-block hover:underline">
            Create your first client →
          </Link>
        </div>
      ) : (
        <div className="portal-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#344060] text-left">
                <th className="px-5 py-3.5 text-[#6a7a90] font-medium text-xs uppercase tracking-wider">Client</th>
                <th className="px-5 py-3.5 text-[#6a7a90] font-medium text-xs uppercase tracking-wider">Username</th>
                <th className="px-5 py-3.5 text-[#6a7a90] font-medium text-xs uppercase tracking-wider">Setups</th>
                <th className="px-5 py-3.5 text-[#6a7a90] font-medium text-xs uppercase tracking-wider">Last login</th>
                <th className="px-5 py-3.5 text-[#6a7a90] font-medium text-xs uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <tr
                  key={client.id}
                  className={`border-b border-[#2c3d5e] hover:bg-[#2c3d5e]/50 transition-colors ${i === clients.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#f0ede8]">{client.name}</div>
                    {client.telegram && (
                      <div className="text-xs text-[#6a7a90] mt-0.5">{client.telegram}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#a8b8cc] font-mono text-xs">{client.username}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {client.setups?.length === 0 && (
                        <span className="text-[#6a7a90] text-xs">No setups</span>
                      )}
                      {client.setups?.map(s => (
                        <span
                          key={s.id}
                          className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(s.status)}`}
                        >
                          {SETUP_TYPES[s.type]?.label || s.type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#6a7a90] text-xs">
                    {client.last_login
                      ? new Date(client.last_login).toLocaleDateString('en-GB')
                      : 'Never'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/${SEGMENT}/clients/${client.id}`}
                      className="text-[#e8914a] text-xs hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}