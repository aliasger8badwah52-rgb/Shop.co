'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { allProducts } from '@/lib/products'

const categories = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Shorts', 'Dresses', 'Pants', 'Jackets', 'Hoodies', 'Skirts', 'Tops']
const colorsList = ['#3B1F1F', '#222', '#4A6FA5', '#6B8E6B', '#C4A882', '#E8B4B8']

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

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Most Popular')

  const ITEMS_PER_PAGE = 9

  const filteredProducts = useMemo(() => {
    let result = [...allProducts]
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory)

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.priceNum - b.priceNum)
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.priceNum - a.priceNum)
    else if (sortBy === 'Newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else result.sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedCategory, sortBy])

  const totalPages = Math.max(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), 10)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-5xl font-black capitalize tracking-tight text-black mb-10">Shop</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="border border-gray-200 rounded-2xl p-6 sticky top-24 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-black">Filters</h3>
                <button
                  onClick={() => { setSelectedCategory('All'); setCurrentPage(1) }}
                  className="text-xs text-gray-400 hover:text-black transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">Category</h4>
                <div className="flex flex-col gap-2">
                  {categories.slice(1).map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => { setSelectedCategory(selectedCategory === cat ? 'All' : cat); setCurrentPage(1) }}
                        className="rounded accent-black"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">Price Range</h4>
                <input type="range" min="0" max="500" defaultValue="400" className="w-full accent-black" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span><span>$500</span>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {colorsList.map((c) => (
                    <button key={c} className="w-7 h-7 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{ backgroundColor: c }} aria-label={`Color ${c}`} />
                  ))}
                </div>
              </div>

              <button className="w-full bg-black text-white rounded-full py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Products Column */}
          <div className="flex-1">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1) }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${cat === selectedCategory ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
                className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium outline-none focus:border-black bg-white"
              >
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Showing <strong className="text-black">{paginatedProducts.length}</strong> of{' '}
              <strong className="text-black">{filteredProducts.length}</strong> products
            </p>

            {/* Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-semibold">No products found.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {paginatedProducts.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`} className="group cursor-pointer block">
                    <div className="bg-[#F2F0F1] rounded-2xl overflow-hidden mb-3 aspect-square relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      {p.discount && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.discount}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{p.category}</span>
                    <div className="font-semibold text-[15px] text-black mb-1 mt-0.5 group-hover:underline">{p.name}</div>
                    <Stars rating={p.rating} />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-black">{p.price}</span>
                      {p.originalPrice && <span className="text-gray-400 line-through text-sm">{p.originalPrice}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-12 flex-wrap gap-4">
              <button
                onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm font-medium hover:border-black disabled:opacity-40 transition-colors"
              >
                <i className="fa-solid fa-chevron-left text-xs" /> Previous
              </button>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm font-medium hover:border-black disabled:opacity-40 transition-colors"
              >
                Next <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
