import Link from 'next/link'
import { products } from '../../lib/products'

const ICONS = {
  Development: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  Marketing: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  Design: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  Enterprise: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  'E-commerce': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
}

const CATEGORY_STYLES = {
  Development:  { bg: 'bg-blue-600',    light: 'bg-blue-50',    text: 'text-blue-600',    hover: 'hover:border-blue-200' },
  Marketing:    { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:border-emerald-200' },
  Design:       { bg: 'bg-violet-600',  light: 'bg-violet-50',  text: 'text-violet-600',  hover: 'hover:border-violet-200' },
  Enterprise:   { bg: 'bg-orange-500',  light: 'bg-orange-50',  text: 'text-orange-600',  hover: 'hover:border-orange-200' },
  'E-commerce': { bg: 'bg-cyan-600',    light: 'bg-cyan-50',    text: 'text-cyan-600',    hover: 'hover:border-cyan-200' },
}

function ServiceCard({ product }) {
  const style = CATEGORY_STYLES[product.category] || CATEGORY_STYLES.Development
  const icon = ICONS[product.category] || ICONS.Development

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className={`bg-white rounded-2xl border border-gray-100 ${style.hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden`}>
        <div className={`${style.bg} p-6`}>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              {icon}
            </div>
            {product.badge && (
              <span className="text-xs font-semibold text-white bg-white/20 px-2.5 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${style.text} mb-1`}>{product.category}</p>
          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{product.description}</p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-400">from </span>
              <span className="font-bold text-gray-900">€{product.price.toLocaleString()}</span>
              {product.compareAt && (
                <span className="text-xs text-gray-400 line-through ml-2">€{product.compareAt.toLocaleString()}</span>
              )}
            </div>
            <span className={`text-xs font-semibold ${style.text} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
              Learn more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[450px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-xs font-semibold tracking-wider uppercase text-blue-300">
                IT Services Agency
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.08] mb-6">
              We build digital<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                products that grow
              </span>
              <br />your business.
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              From custom websites to full business automation — we deliver
              scalable digital solutions that drive real, measurable results.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#services"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
              >
                View Services
              </a>
              <a
                href="#services"
                className="bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Free Consultation
              </a>
            </div>
            <div className="flex items-center gap-8 mt-14">
              <div>
                <div className="font-bold text-3xl text-white">200+</div>
                <div className="text-xs text-slate-400 mt-0.5">Projects delivered</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <div className="font-bold text-3xl text-white">5.0★</div>
                <div className="text-xs text-slate-400 mt-0.5">Average rating</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <div className="font-bold text-3xl text-white">98%</div>
                <div className="text-xs text-slate-400 mt-0.5">Client satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">💬 Free consultation</span>
            <span className="flex items-center gap-2">🚀 Fast delivery</span>
            <span className="flex items-center gap-2">🔒 Secure & confidential</span>
            <span className="flex items-center gap-2">⚙️ Ongoing support</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">What we offer</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-500 mt-1">Everything you need to grow your digital presence</p>
          </div>
          <span className="text-sm text-gray-400">{products.length} services</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ServiceCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 text-center mb-2">How we work</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Simple, transparent process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery Call',
                desc: 'We learn about your business, goals, and requirements in a free consultation — no obligations, no pressure.',
              },
              {
                step: '02',
                title: 'Proposal & Design',
                desc: 'You receive a clear proposal with scope, timeline, and pricing. We then start designing your tailored solution.',
              },
              {
                step: '03',
                title: 'Build & Launch',
                desc: 'We develop, test, and launch your project — with full handover, documentation, and ongoing support included.',
              },
            ].map(item => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm overflow-hidden">
                <div className="text-7xl font-bold text-slate-50 absolute -top-2 -right-2 select-none">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-5 relative">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 text-center mb-2">Our advantages</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why choose BasiQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Results-Driven',
                desc: 'Every decision we make is backed by data and focused on achieving measurable outcomes for your business.',
              },
              {
                icon: '⚡',
                title: 'Modern Tech Stack',
                desc: 'We use the latest technologies to build fast, scalable, and maintainable solutions that stand the test of time.',
              },
              {
                icon: '🤝',
                title: 'True Partnership',
                desc: 'We work as an extension of your team — transparent communication, honest advice, and long-term thinking.',
              },
            ].map(item => (
              <div key={item.title} className="bg-slate-50 rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
