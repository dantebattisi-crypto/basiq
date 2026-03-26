import { getClientSession } from '../../../lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '../../../components/client/LogoutButton'

export default async function ClientLayout({ children }) {
  const session = await getClientSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#1e2d42] font-sans">
      <header className="bg-[#1a2538] border-b border-[#2c3d5e] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[#f0ede8] font-semibold text-sm">BasiQ</div>
            <span className="text-[#344060]">·</span>
            <span className="text-[#6a7a90] text-sm">{session.name}</span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
