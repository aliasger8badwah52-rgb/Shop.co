import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from './header'
import { CartProvider } from '@/components/CartProvider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SHOP.CO — Find Clothes That Match Your Style',
  description: 'Browse our diverse range of meticulously crafted garments.',
}

/* ─── Footer data ─────────────────────────────────────────── */
const footerCols = [
  { title: 'Company', links: ['About', 'Features', 'Works', 'Career'] },
  { title: 'Help', links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'] },
  { title: 'FAQ', links: ['Account', 'Manage Deliveries', 'Orders', 'Payments'] },
  { title: 'Resources', links: ['Free eBooks', 'Development Tutorial', 'How-to Blog', 'Youtube Playlist'] },
]

const payments = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'G Pay']

const socials = [
  { icon: 'fa-brands fa-x-twitter', label: 'Twitter' },
  { icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
  { icon: 'fa-brands fa-instagram', label: 'Instagram' },
  { icon: 'fa-brands fa-github', label: 'GitHub' },
]

/* ─── Layout ──────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">

        {/* ── Header (client component for active link highlighting) ── */}
        <CartProvider>
          <Header />

          {/* ── Page content ── */}
          <main className="flex-1">{children}</main>
        </CartProvider>

        {/* ── Footer ── */}
        <footer className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 pt-10 sm:pt-14 pb-6">
          <div className="container mx-auto">

            {/* Top grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 pb-8 sm:pb-10 border-b border-gray-200">
              {/* Brand */}
              <div className="col-span-2 sm:col-span-2 md:col-span-1">
                <span className="text-lg sm:text-xl font-black tracking-[-0.5px] text-black">SHOP.CO</span>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed max-w-[220px]">
                  We have clothes that suit your style and which you&apos;re proud to wear. From women to men.
                </p>
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5 flex-wrap">
                  {socials.map(({ icon, label }) => (
                    <a key={label} href="#" aria-label={label}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center text-xs sm:text-sm text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                      <i className={icon} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              {footerCols.map(({ title, links }) => (
                <div key={title}>
                  <h4 className="font-bold text-black text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">{title}</h4>
                  <ul className="flex flex-col gap-2 sm:gap-3">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-500 text-xs sm:text-sm hover:text-black transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
              <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">Shop.co © 2000-2023, All Rights Reserved</p>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                {payments.map((p) => (
                  <span key={p} className="border border-gray-300 rounded-md px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-600 bg-white">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
