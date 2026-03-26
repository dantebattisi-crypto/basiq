import Link from 'next/link'
import Image from 'next/image'
import { products } from '../../lib/products'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm text-gray-700">
            {product.badge}
          </span>
        )}
        {product.compareAt && (
          <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</p>
        <h3 className="font-semibold text-gray-900 group-hover:text-rose-500 transition-colors leading-tight">
          {product.name}
        </h3>
        <StarRating rating={product.rating} />
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-gray-900">€{product.price.toFixed(2)}</span>
          {product.compareAt && (
            <span className="text-sm text-gray-400 line-through">€{product.compareAt.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-4">
              Premium Skincare
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Glow from the<br />
              <span className="text-rose-500">inside out.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Science-backed formulas with natural ingredients.
              Designed for real results, every skin type.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#products" className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Shop Now
              </a>
              <a href="#products" className="bg-white text-gray-900 px-8 py-3.5 rounded-full font-semibold border border-gray-200 hover:border-gray-300 transition-colors">
                View All
              </a>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">50k+</div>
                <div className="text-xs text-gray-500">Happy customers</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">4.8★</div>
                <div className="text-xs text-gray-500">Average rating</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">100%</div>
                <div className="text-xs text-gray-500">Natural ingredients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">🚚 Free shipping over €50</span>
            <span className="flex items-center gap-2">↩️ 30-day returns</span>
            <span className="flex items-center gap-2">🔒 Secure checkout</span>
            <span className="flex items-center gap-2">🌿 Natural ingredients</span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
            <p className="text-gray-500 mt-1">Premium skincare for every routine</p>
          </div>
          <span className="text-sm text-gray-400">{products.length} products</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why LumiGlow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🧪', title: 'Science-Backed', desc: 'Every formula developed with dermatologists and backed by clinical studies.' },
              { icon: '🌿', title: 'Clean Ingredients', desc: 'No parabens, sulfates, or artificial fragrances. Just what your skin needs.' },
              { icon: '♻️', title: 'Sustainable', desc: 'Recyclable packaging and cruelty-free formulations you can feel good about.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
