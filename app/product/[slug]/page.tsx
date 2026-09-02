import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import AddToCartButton from './AddToCartButton'
import ProductAnimations from './ProductAnimations'

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex gap-0.5 text-yellow-400 text-sm">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i}>★</span>
        if (i === full && half) return <span key={i} className="opacity-50">★</span>
        return <span key={i} className="text-gray-300">★</span>
      })}
    </div>
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductAnimations>
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-24 mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              {/* Product Image */}
              <div className="product-image lg:w-1/2 w-full relative">
              <img
                alt={product.name}
                className="lg:w-full w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover object-center rounded-2xl shadow-md"
                src={product.image}
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="product-details lg:w-1/2 w-full lg:pl-12 lg:py-6 mt-8 lg:mt-0">
              <h2 className="text-xs title-font text-gray-400 tracking-[0.15em] uppercase font-semibold mb-2">
                {product.brand} · {product.category}
              </h2>
              <h1 className="text-gray-900 text-2xl sm:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex mb-5 items-center gap-3">
                <Stars rating={Number(product.rating)} />
                <span className="text-gray-400 text-sm font-medium">{product.rating} / 5.0</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-base sm:text-lg">{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>

              <p className="leading-relaxed text-gray-600 mb-6 text-[15px]">{product.description}</p>

              {/* Color and Size */}
              <div className="flex flex-col sm:flex-row mt-2 items-start sm:items-center pb-5 border-b border-gray-100 mb-5 gap-4 sm:gap-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700 mr-1">Color</span>
                  {['#222', '#4A6FA5', '#C4A882', '#6B8E6B', '#E8B4B8'].map((c) => (
                    <button
                      key={c}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md focus:ring-2 focus:ring-black transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700 mr-1">Size</span>
                  {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      className="w-9 h-9 rounded-full border border-gray-300 text-xs font-bold hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock badge */}
              {product.stock === 0 ? (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-4">Out of Stock</span>
              ) : product.stock < 20 ? (
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Only {product.stock} left!
                </span>
              ) : null}

                {/* Actions */}
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </section>
      </ProductAnimations>
    </div>
  )
}