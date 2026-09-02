'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { allProducts } from '@/lib/products'

const categories = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Shorts', 'Dresses', 'Pants', 'Jackets', 'Hoodies', 'Skirts', 'Tops']
const colorsList = ['#3B1F1F', '#222222', '#4A6FA5', '#6B8E6B', '#C4A882']

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex gap-0.5 text-yellow-400 text-sm">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <i key={i} className="fa-solid fa-star" />
        if (i === full && half) return <i key={i} className="fa-solid fa-star-half-stroke" />
        return <i key={i} className="fa-regular fa-star" />
      })}
    </div>
  )
}

// Only show products that have a discount
const saleProducts = allProducts.filter((p) => p.discount !== '')

export default function OnSalePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(8)

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return saleProducts
    return saleProducts.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Limited Time
          </span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">On Sale</h1>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">Don&apos;t miss out on these limited-time offers. Upgrade your wardrobe with our premium pieces at unbeatable prices before they&apos;re gone.</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${cat === selectedCategory ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 text-center mb-6">
          Showing <strong className="text-black">{visible.length}</strong> of{' '}
          <strong className="text-black">{filtered.length}</strong> sale items
        </p>

        {/* Products grid */}
        {visible.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-semibold">No sale items in this category.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visible.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group cursor-pointer block">
                <div className="bg-[#F2F0F1] rounded-2xl overflow-hidden mb-3 aspect-square relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.discount}</span>
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">{item.category}</span>
                <div className="font-semibold text-[15px] text-black mb-1 mt-0.5 group-hover:underline">{item.name}</div>
                <div className="mb-2"><Stars rating={item.rating} /></div>
                <div className="flex gap-1 mb-2">
                  {colorsList.slice(0, 3).map((c) => (
                    <div key={c} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">{item.price}</span>
                  {item.originalPrice && <span className="text-gray-400 line-through text-sm">{item.originalPrice}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-14">
            <button
              onClick={() => setVisibleCount((v) => Math.min(v + 8, filtered.length))}
              className="border border-black rounded-full px-12 py-3 text-sm font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
