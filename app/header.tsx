'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/components/CartProvider'
import { allProducts, Product } from '@/lib/products'

const navLinks = [
  { label: 'Shop', href: '/shop', dropdown: true },
  { label: 'On Sale', href: '/on-sale' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Brands', href: '/brands' },
]

/* ─── Search Dropdown ─────────────────────── */
function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) { setResults([]); setOpen(false); return }
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    ).slice(0, 6)
    setResults(filtered)
    setOpen(filtered.length > 0)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
      setOpen(false)
      setQuery('')
    }
    if (e.key === 'Escape') setOpen(false)
  }

  const handleSelect = (slug: string) => {
    setOpen(false)
    setQuery('')
    router.push(`/product/${slug}`)
  }

  return (
    <div ref={ref} className="flex-1 relative min-w-0">
      <div className={`flex items-center bg-gray-100 rounded-full px-3.5 py-1.5 gap-2 transition-all ${focused ? 'ring-2 ring-black/10' : ''}`}>
        <i className="fa-solid fa-magnifying-glass text-gray-400 text-[13px] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products, brands, categories..."
          className="bg-transparent outline-none text-[13px] text-gray-700 placeholder-gray-400 w-full"
          aria-label="Search products"
          id="search-input"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-4 py-3 border-b border-gray-50">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
          <ul>
            {results.map((p) => (
              <li key={p.id}>
                <button
                  onMouseDown={() => handleSelect(p.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-black">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category} · {p.price}</p>
                  </div>
                  {p.discount && (
                    <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      {p.discount}
                    </span>
                  )}
                  <i className="fa-solid fa-arrow-up-left text-gray-300 text-xs rotate-90 group-hover:text-gray-500 transition-colors" />
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-50 px-4 py-3">
            <button
              onMouseDown={() => {
                router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
                setOpen(false)
                setQuery('')
              }}
              className="text-[12px] font-semibold text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-magnifying-glass text-xs" />
              See all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Header ───────────────────────────────── */
export default function Header() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isClosed = localStorage.getItem('shopco_announcement_closed')
      if (isClosed !== 'true') setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('shopco_announcement_closed', 'true')
    setIsVisible(false)
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      {isVisible && (
        <div className="bg-black text-white text-center py-2 px-4 relative flex items-center justify-center">
          <p className="text-[13px] tracking-[0.01em] pr-8">
            Sign up and get 20% off to your first order.{' '}
            <Link href="/account" className="font-semibold underline cursor-pointer">Sign Up Now</Link>
          </p>
          <button onClick={handleClose} className="absolute right-4 text-white hover:text-gray-300 transition-colors" aria-label="Close announcement">
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 py-2.5 px-6">
        <div className="container mx-auto flex items-center gap-5">

          {/* Mobile: burger icon (hidden on desktop) */}
          <button
            className="md:hidden text-gray-900 text-lg hover:text-black transition-colors flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`} />
          </button>

          {/* Logo */}
          <Link href="/" className="text-[20px] sm:text-[22px] font-black tracking-[-0.5px] text-black whitespace-nowrap flex-shrink-0">
            SHOP.CO
          </Link>

          {/* Desktop Nav Links (hidden on mobile) */}
          <ul className="hidden md:flex list-none gap-5 flex-shrink-0">
            {navLinks.map(({ label, href, dropdown }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm text-gray-900 no-underline flex items-center gap-1 whitespace-nowrap hover:text-gray-500 transition-colors ${pathname === href ? 'font-bold underline underline-offset-4' : ''}`}
                >
                  {label}
                  {dropdown && <i className="fa-solid fa-chevron-down fa-xs opacity-60" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search Bar — desktop only */}
          <div className="hidden md:block flex-1 min-w-0">
            <SearchBox />
          </div>

          {/* Right icons — always visible */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto md:ml-0">
            <Link href="/cart" aria-label="Cart" className="text-gray-900 text-lg hover:text-gray-500 transition-colors relative">
              <i className="fa-solid fa-cart-shopping" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Account icon — desktop only */}
            <Link href="/account" aria-label="Account" className="hidden md:block text-gray-900 text-lg hover:text-gray-500 transition-colors">
              <i className="fa-regular fa-circle-user" />
            </Link>
          </div>
        </div>

        {/* Mobile Drawer (burger open) */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 z-50">
            <SearchBox />
            <nav className="flex flex-col gap-4 mt-2">
              {navLinks.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`text-base font-semibold transition-colors ${pathname === href ? 'text-black font-bold' : 'text-gray-600 hover:text-black'}`}>
                  {label}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link href="/account" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gray-600 hover:text-black flex items-center gap-3">
                <i className="fa-regular fa-circle-user text-lg" />
                My Account
              </Link>
            </nav>
          </div>
        )}
      </nav>
    </header>
  )
}
