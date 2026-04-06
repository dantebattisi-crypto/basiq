'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

const LINKS = [
  { href: `/${SEGMENT}/setups`,   label: 'Setups',    icon: '📋' },
  { href: `/${SEGMENT}/clients`,  label: 'Clients',   icon: '👥' },
  { href: `/${SEGMENT}/settings`, label: 'Settings',  icon: '⚙️' },
  { href: `/${SEGMENT}/setup-2fa`, label: '2FA',      icon: '🔐' },
]

function Sidebar({ pathname, onLogout }) {
  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-[#1a2538] border-r border-[#2c3d5e] flex-col flex-shrink-0">
      <div className="p-5 border-b border-[#2c3d5e]">
        <div className="text-[#f0ede8] font-semibold text-sm tracking-wide">BasiQ</div>
        <div className="text-[#6a7a90] text-xs mt-0.5">Admin Panel</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {LINKS.map(link => {
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
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6a7a90] hover:bg-[#253450] hover:text-[#f0ede8] transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

function MobileHeader({ pathname, onLogout }) {
  return (
    <header className="md:hidden bg-[#1a2538] border-b border-[#2c3d5e] px-4 py-3 flex items-center justify-between gap-2 flex-shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[#f0ede8] font-semibold text-sm flex-shrink-0">BasiQ</span>
        <span className="text-[#344060]">·</span>
        <span className="text-[#6a7a90] text-xs">Admin</span>
      </div>
      <div className="flex items-center gap-1">
        {LINKS.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                active
                  ? 'bg-[#e8914a]/15 text-[#e8914a] border border-[#e8914a]/20'
                  : 'text-[#a8b8cc] hover:bg-[#253450]'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
        <button
          onClick={onLogout}
          className="px-2.5 py-1.5 rounded-lg text-xs text-[#6a7a90] hover:bg-[#253450] hover:text-[#f0ede8] transition-all"
        >
          🚪
        </button>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push(`/${process.env.NEXT_PUBLIC_ADMIN_LOGIN_SEGMENT || 'n3r8v5'}`)
  }

  return (
    <div className="min-h-screen bg-[#1e2d42] font-sans flex flex-col md:flex-row">
      {/* Desktop: sidebar on the left */}
      <Sidebar pathname={pathname} onLogout={logout} />

      {/* Right side: mobile header + content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <MobileHeader pathname={pathname} onLogout={logout} />
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
