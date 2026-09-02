'use client'

import { useCart } from '@/components/CartProvider'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart()

  const subtotal = cart.reduce((total, item) => total + item.product.priceNum * item.quantity, 0)
  const discount = subtotal > 100 ? subtotal * 0.1 : 0 // 10% discount if over $100
  const total = subtotal - discount

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Browse our products and find something you love!</p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">YOUR CART</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 py-6 border-b border-gray-100 last:border-0">
                <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight"><Link href={`/product/${item.product.slug}`}>{item.product.name}</Link></h3>
                      <p className="text-sm text-gray-500 mt-1">Size: <span className="text-gray-900">L</span></p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 p-1">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-xl">{item.product.price}</span>
                    
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-gray-500 hover:text-black w-6 text-center">-</button>
                      <span className="font-semibold text-sm w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-gray-500 hover:text-black w-6 text-center">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                  <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount (-10%)</span>
                  <span className="font-bold text-red-500">-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-bold">₹0.00</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold">Total</span>
                <span className="text-2xl font-black">₹{total.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Go to Checkout <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
