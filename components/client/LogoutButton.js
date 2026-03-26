'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/client/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <button
      onClick={logout}
      className="text-xs text-[#6a7a90] hover:text-[#a8b8cc] transition-colors"
    >
      Sign out
    </button>
  )
}
