'use client'

import { useCart } from '@/components/CartProvider'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function CheckoutPage() {
  const { cart, cartCount } = useCart()
  const [mounted, setMounted] = useState(false)

  // Wait for client mount to read cart securely
  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = cart.reduce((total, item) => total + item.product.priceNum * item.quantity, 0)
  const discount = subtotal > 100 ? subtotal * 0.1 : 0
  const total = subtotal - discount

  // Since all products are now in INR (₹1), no conversion is needed
  const totalINR = total.toFixed(2)

  // UPI Link Details
  const upiId = '9303606529@ibl'
  const payeeName = 'Ali asgar'
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${totalINR}&cu=INR`

  if (!mounted) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading checkout...</p></div>

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-center">Secure Checkout</h1>
        <p className="text-gray-500 text-center mb-10">Complete your purchase using UPI</p>
        
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Order Summary */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded bg-gray-100 object-cover" />
                    <div>
                      <p className="font-semibold text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">₹{(item.product.priceNum * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm mb-6 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span className="text-red-500">-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-gray-100">
                <span>Total (INR)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
            <h3 className="font-black text-xl mb-2">Scan & Pay</h3>
            <p className="text-sm text-gray-500 mb-6">Pay instantly via any UPI App</p>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 inline-block">
              <QRCodeSVG value={upiUrl} size={180} level="H" includeMargin={true} />
            </div>

            <div className="bg-blue-50 text-blue-800 text-sm font-semibold py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2 w-full">
              <span>Total to Pay:</span>
              <span className="text-xl font-black">₹{totalINR}</span>
            </div>

            <p className="text-xs text-gray-500 mb-4 font-medium">Paying to: {upiId} ({payeeName})</p>

            {/* Pay Button - works on mobile, shows deep link */}
            <a
              href={upiUrl}
              className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-3 text-base active:scale-95"
            >
              <i className="fa-solid fa-mobile-screen-button" />
              Pay ₹{totalINR} via UPI App
            </a>

            <p className="text-[11px] text-gray-400 hidden md:block mb-3">
              On desktop? Scan the QR code above with your phone camera or any UPI app.
            </p>

            <p className="text-[10px] text-gray-400 mt-2 max-w-[250px]">
              After payment is successful, your order will be confirmed automatically based on the transaction reference.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
