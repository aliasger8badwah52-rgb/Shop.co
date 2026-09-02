'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { allProducts } from '@/lib/products'

const categories = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Shorts', 'Dresses', 'Pants', 'Jackets', 'Hoodies', 'Skirts', 'Tops']

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

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Newest First')
  const [visibleCount, setVisibleCount] = useState(8)

  const filtered = useMemo(() => {
    let result = [...allProducts]
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory)

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.priceNum - b.priceNum)
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.priceNum - a.priceNum)
    else if (sortBy === 'Top Rated') result.sort((a, b) => b.rating - a.rating)
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return result
  }, [selectedCategory, sortBy])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Just Dropped
          </span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">New Arrivals</h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-base">Fresh styles added weekly — be the first to wear the latest trends.</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 border-b border-gray-100 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border transition-colors ${cat === selectedCategory ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count and Sort */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <p className="text-gray-500 text-sm">
            Showing <strong className="text-black">{visible.length}</strong> of <strong className="text-black">{filtered.length}</strong> items
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              id="new-arrivals-sort"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setVisibleCount(8) }}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium outline-none focus:border-black bg-white"
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-semibold">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visible.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group cursor-pointer block">
                <div className="bg-[#F2F0F1] rounded-2xl overflow-hidden mb-3 aspect-square relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {item.discount && (
                    <span className="absolute top-3 right-3 text-white text-xs font-bold px-2 py-0.5 rounded-full bg-red-500">{item.discount}</span>
                  )}
                </div>
                <div className="font-semibold text-[15px] text-black mb-1 group-hover:underline">{item.name}</div>
                <Stars rating={item.rating} />
                <div className="flex items-center gap-2 mt-1">
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
