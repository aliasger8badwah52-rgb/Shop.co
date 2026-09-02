'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [showPopup, setShowPopup] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  return (
    <>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors">
          <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
          </svg>
        </button>
      </div>

      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50 animate-bounce">
          <span>Added {product.name} to cart!</span>
          <Link href="/cart" className="underline font-bold hover:text-green-100">
            View Cart
          </Link>
        </div>
      )}
    </>
  )
}
