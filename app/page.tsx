'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NewsletterForm from '@/components/frontend/NewsletterForm'

gsap.registerPlugin(ScrollTrigger, useGSAP)
import p1 from '../public/Images/p1.png'
import p2 from '../public/Images/p2.png'
import p3 from '../public/Images/p3.png'
import p4 from '../public/Images/p4.png'
import T1 from '../public/Images/t1.png'
import T2 from '../public/Images/t2.png'
import T3 from '../public/Images/t3.png'
import T4 from '../public/Images/t4.png'
import b1 from '../public/Images/b1.png'
import b2 from '../public/Images/b2.png'
import b3 from '../public/Images/b3.png'
import b4 from '../public/Images/b4.png'

/* ─── Data ─────────────────────────────────────────────────── */
const brands = ['VERSACE', 'Zara', 'GUCCI', 'PRADA', 'Calvin Klein']

const newArrivalsData = [
  { id: 1, slug: 't-shirt-with-tape-details', name: 'T-shirt with Tape Details', rating: 4.5, price: '₹1', original: null, image: p1 },
  { id: 2, slug: 'skinny-fit-jeans', name: 'Skinny Fit Jeans', rating: 3.5, price: '₹1', original: null, image: p2 },
  { id: 3, slug: 'checkered-shirt', name: 'Checkered Shirt', rating: 4.5, price: '₹1', original: null, image: p3 },
  { id: 4, slug: 'sleeve-striped-t-shirt', name: 'Sleeve Striped T-shirt', rating: 4.5, price: '₹1', original: null, discount: '-20%', image: p4 },
]

const topSellingData = [
  { id: 1, slug: 'vertical-striped-shirt', name: 'Vertical Striped Shirt', rating: 5, price: '₹1', original: null, discount: '-20%', image: T1 },
  { id: 2, slug: 'courage-graphic-t-shirt', name: 'Courage Graphic T-shirt', rating: 4, price: '₹1', original: null, image: T2 },
  { id: 3, slug: 'loose-fit-bermuda-shorts', name: 'Loose Fit Bermuda Shorts', rating: 3, price: '₹1', original: null, image: T3 },
  { id: 4, slug: 'faded-skinny-jeans', name: 'Faded Skinny Jeans', rating: 4.5, price: '₹1', original: null, image: T4 },
]

const dressStyles = [
  { id: 1, label: 'Casual', wide: false, image: b1 },
  { id: 2, label: 'Formal', wide: true, image: b2 },
  { id: 3, label: 'Party', wide: true, image: b3 },
  { id: 4, label: 'Gym', wide: false, image: b4 },
]

const reviewsData = [
  { id: 1, author: 'Sarah M.', rating: 5, text: '"I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations."' },
  { id: 2, author: 'Alex K.', rating: 4, text: '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes."' },
  { id: 3, author: 'James L.', rating: 5, text: '"As someone who\'s always on the lookout for unique fashion pieces, I\'m thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."' },
]

const flashSaleData = [
  { id: 101, slug: 'sleeve-striped-t-shirt', name: 'Sleeve Striped T-shirt', rating: 4.5, price: '₹1', original: null, discount: '-20%', image: p4 },
  { id: 102, slug: 'vertical-striped-shirt', name: 'Vertical Striped Shirt', rating: 5, price: '₹1', original: null, discount: '-20%', image: T1 },
  { id: 103, slug: 'skinny-fit-jeans', name: 'Skinny Fit Jeans', rating: 3.5, price: '₹1', original: null, discount: '-10%', image: p2 },
  { id: 104, slug: 'faded-skinny-jeans', name: 'Faded Skinny Jeans', rating: 4.5, price: '₹1', original: null, discount: '-20%', image: T4 },
]

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 48, seconds: 12 })

  useEffect(() => {
    const target = new Date()
    target.setHours(target.getHours() + 3)

    const interval = setInterval(() => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-2 items-center text-black">
      <div className="flex flex-col items-center bg-black text-white rounded-lg px-2.5 py-1.5 min-w-[55px]">
        <span className="text-base font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-wider font-semibold opacity-60">Hours</span>
      </div>
      <div className="text-lg font-bold">:</div>
      <div className="flex flex-col items-center bg-black text-white rounded-lg px-2.5 py-1.5 min-w-[55px]">
        <span className="text-base font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-wider font-semibold opacity-60">Mins</span>
      </div>
      <div className="text-lg font-bold">:</div>
      <div className="flex flex-col items-center bg-red-600 text-white rounded-lg px-2.5 py-1.5 min-w-[55px] animate-pulse">
        <span className="text-base font-bold tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-wider font-semibold opacity-90">Secs</span>
      </div>
    </div>
  )
}

/* ─── Helpers ───────────────────────────────────────────────── */
const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C12 7.97 16.03 12 21 12C16.03 12 12 16.03 12 21C12 16.03 7.97 12 3 12C7.97 12 12 7.97 12 3Z" />
  </svg>
)

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

const ProductCard = ({ p }: { p: typeof newArrivalsData[0] }) => (
  <Link href={`/product/${p.slug}`} className="group cursor-pointer block">
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      <div className="bg-[#F2F0F1] rounded-xl overflow-hidden mb-4 aspect-square relative">
        <Image src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="font-bold text-[16px] text-black mb-1 truncate px-1">{p.name}</div>
      <div className="px-1 mb-2">
        <Stars rating={p.rating} />
      </div>
      <div className="flex items-center gap-2 mt-1 px-1 pb-1">
        <span className="font-black text-lg text-black">{p.price}</span>
        {p.original && <span className="text-gray-400 line-through text-sm font-semibold">{p.original}</span>}
        {'discount' in p && p.discount && (
          <span className="bg-red-100/80 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-full">{p.discount}</span>
        )}
      </div>
    </motion.div>
  </Link>
)

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Animate sections on scroll
    const sections = gsap.utils.toArray('.gsap-section')
    sections.forEach((section: any) => {
      gsap.fromTo(section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })
  }, { scope: mainRef })

  return (
    <div ref={mainRef}>
      {/* ── Hero ── */}
      <section className="bg-[#F2F0F1] overflow-hidden min-h-[calc(100vh-80px)] flex items-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-transparent to-transparent opacity-60" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[calc(100vh-80px)]">
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col justify-center gap-5 py-10 md:py-20"
            >
              <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-black leading-[1.05] tracking-tight uppercase text-black">
                Find Clothes That Matches Your Style
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-[480px]">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
              </p>
              <motion.a
                href="/shop"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center bg-black text-white rounded-full px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-bold w-fit hover:bg-gray-800 transition-colors shadow-2xl shadow-black/30 mt-2"
              >
                Shop Now
              </motion.a>
              {/* Stats */}
              <div className="flex gap-4 sm:gap-6 md:gap-10 pt-6 mt-2 flex-wrap">
                <div className="flex flex-col border-r-2 border-gray-200/80 pr-4 sm:pr-6 md:pr-10">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black leading-none">200+</span>
                  <span className="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">International Brands</span>
                </div>
                <div className="flex flex-col border-r-2 border-gray-200/80 pr-4 sm:pr-6 md:pr-10">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black leading-none">2,000+</span>
                  <span className="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">High-Quality Products</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black leading-none">30,000+</span>
                  <span className="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">Happy Customers</span>
                </div>
              </div>
            </motion.div>
            {/* Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-[4/5] md:aspect-square flex items-center justify-center"
            >
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] right-[10%] w-16 h-16 md:w-24 md:h-24 text-black z-20"
              >
                <SparkleIcon className="w-full h-full" />
              </motion.div>
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[45%] left-[-5%] md:left-[5%] w-10 h-10 md:w-14 md:h-14 text-black z-20"
              >
                <SparkleIcon className="w-full h-full" />
              </motion.div>
              
              <div className="absolute inset-0 rounded-[3rem] bg-gray-200 overflow-hidden shadow-2xl">
                <Image src={p1} alt="Hero fashion" fill className="object-cover object-top" priority />
              </div>
              
              {/* Glassmorphism Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-10 -left-6 md:left-[-10%] bg-white/70 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl">
                  <i className="fa-solid fa-star" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wider">Top Rated</p>
                  <p className="text-xs text-gray-600 font-medium">Summer Collection &apos;26</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Brands Strip ── */}
      <section className="bg-black py-8 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        <motion.div 
          className="flex whitespace-nowrap gap-16 md:gap-32 w-max"
          animate={{ x: [0, -1035] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate brands multiple times for infinite scroll effect */}
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <span key={`${brand}-${i}`} className="text-white font-extrabold text-2xl md:text-4xl tracking-widest opacity-80 hover:opacity-100 transition-opacity select-none cursor-default">
              {brand}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="gsap-section py-16 px-6 bg-white border-b border-gray-100 min-h-screen flex justify-center items-center">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Why Shop With Us</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-2">
              Experience Superior Fashion Shopping
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              We specialize in bringing high-end curated designs directly to your doorstep with unmatched service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-50/50 group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <i className="fa-solid fa-truck-fast text-lg" />
              </div>
              <h3 className="font-bold text-lg text-black mb-2">Free & Fast Shipping</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Get free standard shipping on all orders over $150. Fast, reliable delivery to your door.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-50/50 group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <i className="fa-solid fa-shield-halved text-lg" />
              </div>
              <h3 className="font-bold text-lg text-black mb-2">Secure Payments</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your transactions are safe with us. We support major credit cards, PayPal, and digital wallets securely.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-50/50 group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <i className="fa-solid fa-rotate-left text-lg" />
              </div>
              <h3 className="font-bold text-lg text-black mb-2">Easy Returns</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Not satisfied with your fit? Return or exchange any item within 30 days hassle-free.
              </p>
            </div>

            {/* Card 4 */}
            <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-50/50 group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <i className="fa-solid fa-headset text-lg" />
              </div>
              <h3 className="font-bold text-lg text-black mb-2">24/7 Dedicated Support</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Have questions? Our support team is available round the clock to assist you with order tracking and inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="gsap-section py-10 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-10 gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black">New Arrivals</h2>
            <a href="/new-arrivals" className="flex-shrink-0 border border-black rounded-full px-4 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition-colors whitespace-nowrap">
              View All
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {newArrivalsData.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200 mx-4 sm:mx-6" />

      {/* ── Top Selling ── */}
      <section className="gsap-section py-10 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-10 gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black">Top Selling</h2>
            <a href="/shop" className="flex-shrink-0 border border-black rounded-full px-4 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition-colors whitespace-nowrap">
              View All
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {topSellingData.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── Flash Sale ── */}
      <section className="gsap-section py-10 sm:py-16 px-4 sm:px-6 bg-[#FAF9F6] border-t border-b border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-gray-200">
            <div className="min-w-0">
              <span className="bg-red-100 text-red-600 text-[10px] sm:text-[11px] font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                Limited Time Offer
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-2 sm:mt-3">
                Flash Sale of the Day
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Grab your favorite pieces before they are gone forever. Deals ending soon!
              </p>
            </div>
            <div className="flex-shrink-0">
              <CountdownTimer />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {flashSaleData.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── Dress Style ── */}
      <section className="gsap-section py-10 sm:py-16 px-4 sm:px-6 bg-[#F2F0F1] rounded-3xl mx-2 sm:mx-4 mb-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black text-center mb-6 sm:mb-10">
            Browse by Dress Style
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px]">
            {dressStyles.map((s) => (
              <a
                key={s.id}
                href={`/shop?style=${s.label.toLowerCase()}`}
                className={`relative rounded-2xl overflow-hidden group ${s.wide ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <span className="absolute top-3 left-3 sm:top-4 sm:left-5 font-bold text-sm sm:text-xl text-black z-10">{s.label}</span>
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Style Lookbook ── */}
      <section className="gsap-section py-16 px-6 bg-white border-t border-gray-100">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400">#SHOPCOSTYLE</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-2">
              Style Lookbook
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              See how our community style their favorite Shop.co pieces. Tag us on Instagram to be featured!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
              <Image src={p1} alt="Style Lookbook 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm">@alex_k</span>
                <span className="text-gray-300 text-xs mt-1">Styling "Tape Details Tee"</span>
              </div>
            </div>
            <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
              <Image src={p3} alt="Style Lookbook 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm">@sophia.m</span>
                <span className="text-gray-300 text-xs mt-1">Checkered vibe in city</span>
              </div>
            </div>
            <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
              <Image src={T2} alt="Style Lookbook 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm">@marcus_wear</span>
                <span className="text-gray-300 text-xs mt-1">Streetwear graphics mood</span>
              </div>
            </div>
            <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
              <Image src={T4} alt="Style Lookbook 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm">@jess_style</span>
                <span className="text-gray-300 text-xs mt-1">Sunset styling in denim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="gsap-section py-10 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-10 gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tight text-black leading-tight">Our Happy Customers</h2>
            <div className="flex gap-2 flex-shrink-0">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white" aria-label="Previous">
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white" aria-label="Next">
                <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {reviewsData.map((r) => (
              <div key={r.id} className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3">
                <Stars rating={r.rating} />
                <div className="flex items-center gap-2 font-bold text-black">
                  {r.author}
                  <i className="fa-solid fa-circle-check text-green-500 text-sm" />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Showcase ── */}
      <section className="gsap-section py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Browse by Category</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black mt-2">Shop Your Style</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {[
              { icon: 'fa-solid fa-shirt', label: 'T-Shirts', href: '/shop?category=T-Shirts', color: 'bg-orange-50 text-orange-600 hover:bg-orange-500' },
              { icon: 'fa-solid fa-vest', label: 'Shirts', href: '/shop?category=Shirts', color: 'bg-blue-50 text-blue-600 hover:bg-blue-500' },
              { icon: 'fa-solid fa-person', label: 'Jeans', href: '/shop?category=Jeans', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-500' },
              { icon: 'fa-solid fa-socks', label: 'Shorts', href: '/shop?category=Shorts', color: 'bg-green-50 text-green-600 hover:bg-green-500' },
              { icon: 'fa-solid fa-user-tie', label: 'Jackets', href: '/shop?category=Jackets', color: 'bg-gray-100 text-gray-700 hover:bg-gray-800' },
              { icon: 'fa-solid fa-star', label: 'Hoodies', href: '/shop?category=Hoodies', color: 'bg-purple-50 text-purple-600 hover:bg-purple-500' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-2xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cat.color} hover:text-white`}
            >
              <i className={`${cat.icon} text-lg sm:text-2xl transition-transform group-hover:scale-110 duration-300`} />
              <span className="font-bold text-[11px] sm:text-sm tracking-wide text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Now Editorial Banner ── */}
      <section className="gsap-section py-4 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big card */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden min-h-[380px] bg-black group cursor-pointer">
              <Image src={T1} alt="Trending" fill className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-white text-black text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Trending Now</span>
                <h3 className="text-white text-3xl md:text-4xl font-black leading-tight mb-3">Vertical Striped<br/>Shirt Collection</h3>
                <Link href="/product/vertical-striped-shirt" className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
                  Shop Now <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </div>
            {/* Two small cards */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-3xl overflow-hidden min-h-[178px] bg-black group cursor-pointer flex-1">
                <Image src={p4} alt="Sale" fill className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">-20% OFF</span>
                  <h4 className="text-white text-lg font-black">Sleeve Striped Tee</h4>
                  <Link href="/product/sleeve-striped-t-shirt" className="text-white/80 text-xs font-semibold hover:text-white transition-colors flex items-center gap-1 mt-1">
                    Shop <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden min-h-[178px] bg-black group cursor-pointer flex-1">
                <Image src={p2} alt="New" fill className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="bg-black border border-white/30 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">New</span>
                  <h4 className="text-white text-lg font-black">Skinny Fit Jeans</h4>
                  <Link href="/product/skinny-fit-jeans" className="text-white/80 text-xs font-semibold hover:text-white transition-colors flex items-center gap-1 mt-1">
                    Shop <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Trust Strip ── */}
      <section className="gsap-section py-12 sm:py-20 px-4 sm:px-6 bg-black mt-8 sm:mt-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            {[
              { value: '200+', label: 'International Brands', icon: 'fa-solid fa-globe' },
              { value: '50K+', label: 'Happy Customers', icon: 'fa-solid fa-face-smile' },
              { value: '2000+', label: 'Products Available', icon: 'fa-solid fa-bag-shopping' },
              { value: '4.9★', label: 'Average Rating', icon: 'fa-solid fa-star' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center gap-2 sm:gap-3"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <i className={`${s.icon} text-white text-base sm:text-lg`} />
                </div>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white break-all">{s.value}</span>
                <span className="text-gray-400 text-xs sm:text-sm font-medium text-center">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gsap-section">
        <NewsletterForm />
      </div>
    </div>
  )
}
