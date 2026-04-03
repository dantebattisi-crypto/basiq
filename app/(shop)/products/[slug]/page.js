import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, products } from '../../../../lib/products'
import BookingModal from '../../../../components/client/BookingModal'

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug)
  if (!product) return {}
  return { title: `${product.name} — BasiQ IT Services`, description: product.description }
}

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-600">{rating} · {reviews} reviews</span>
    </div>
  )
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const related = products.filter(p => p.id !== product.id).slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
          {product.compareAt && (
            <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              PROMO
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <StarRating rating={product.rating} reviews={product.reviews} />

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-xs text-gray-400 text-lg">from</span>
            <span className="text-3xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
            {product.compareAt && (
              <span className="text-lg text-gray-400 line-through">€{product.compareAt.toFixed(2)}</span>
            )}
            {product.compareAt && (
              <span className="text-sm font-semibold text-blue-600">
                Save €{(product.compareAt - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mt-5 text-sm">{product.description}</p>

          {/* Benefits */}
          <ul className="mt-5 space-y-2">
            {product.benefits.map(b => (
              <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-blue-500">✓</span> {b}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="mt-8">
            <BookingModal productName={product.name} productPrice={product.price} />
          </div>

          {/* Trust */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>💬 Free initial consultation</span>
            <span>✅ Satisfaction guaranteed</span>
            <span>🔒 Secure & confidential</span>
          </div>

          {/* Process */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Our process</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.howToUse}</p>
          </div>

          {/* Technologies */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Technologies used</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{product.ingredients}</p>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group block">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{p.name}</p>
              <p className="text-xs text-gray-400 mt-1">from €{p.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
