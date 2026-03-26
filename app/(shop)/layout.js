import Link from 'next/link'

function ShopNav() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
            Lumi<span className="text-rose-500">Glow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Shop</Link>
            <Link href="/pages/refund-policy" className="hover:text-gray-900 transition-colors">Returns</Link>
            <Link href="/pages/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping</Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Free shipping over €50</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function ShopFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="font-bold text-xl tracking-tight text-gray-900 mb-3">
              Lumi<span className="text-rose-500">Glow</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Premium health & beauty products crafted for modern skincare routines.
              Natural ingredients, science-backed formulas.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Shop</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-gray-900 transition-colors">All Products</Link></li>
              <li><Link href="/pages/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping Info</Link></li>
              <li><Link href="/pages/refund-policy" className="hover:text-gray-900 transition-colors">Returns</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/pages/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/pages/terms-of-service" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/pages/refund-policy" className="hover:text-gray-900 transition-colors">Refund Policy</Link></li>
              <li><Link href="/pages/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LumiGlow Beauty Ltd. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Registered in England & Wales · Company No. 12345678
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <ShopNav />
      <main>{children}</main>
      <ShopFooter />
    </div>
  )
}
