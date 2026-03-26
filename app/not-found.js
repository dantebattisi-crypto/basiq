import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1e2d42] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#e8914a] font-mono text-6xl font-light mb-4">404</p>
        <h1 className="text-xl font-semibold text-[#f0ede8] mb-2">Page not found</h1>
        <p className="text-[#6a7a90] text-sm mb-8">This page doesn't exist or you don't have access.</p>
        <Link href="/" className="text-sm text-[#e8914a] hover:underline">
          ← Go home
        </Link>
      </div>
    </div>
  )
}
