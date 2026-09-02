'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing! Check your email.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="bg-black rounded-3xl mx-2 sm:mx-4 mt-8 sm:mt-16 mb-8 sm:mb-10 py-10 sm:py-14 px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight max-w-sm leading-tight text-center md:text-left">
        Stay Up To Date About Our Latest Offers
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full md:w-auto md:min-w-[360px]">
        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-4 sm:px-5 py-2.5 sm:py-3">
          <i className="fa-regular fa-envelope text-gray-400 text-sm sm:text-base" />
          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="flex-1 outline-none text-xs sm:text-sm text-gray-700 bg-transparent disabled:opacity-50"
          />
        </div>
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-black font-semibold rounded-full py-2.5 sm:py-3 px-6 hover:bg-gray-100 transition-colors text-xs sm:text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Subscribing...
            </>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>
        {message && (
          <p className={`text-sm font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'} mt-1`}>
            {message}
          </p>
        )}
      </form>
    </section>
  )
}
