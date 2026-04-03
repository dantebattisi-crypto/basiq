'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: `/${SEGMENT}/clients`, label: 'Clients', icon: '👥' },
    { href: `/${SEGMENT}/setup-2fa`, label: 'Setup 2FA', icon: '🔐' },
  ]

  async function logout() {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push(`/${process.env.NEXT_PUBLIC_ADMIN_LOGIN_SEGMENT || 'n3r8v5'}`)
  }

  return (
    <aside className="w-56 min-h-screen bg-[#1a2538] border-r border-[#2c3d5e] flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-[#2c3d5e]">
        <div className="text-[#f0ede8] font-semibold text-sm tracking-wide">BasiQ</div>
        <div className="text-[#6a7a90] text-xs mt-0.5">Admin Panel</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/20'
                  : 'text-[#a8b8cc] hover:bg-[#253450] hover:text-[#f0ede8]'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#2c3d5e]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6a7a90] hover:bg-[#253450] hover:text-[#f0ede8] transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#1e2d42] flex font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
