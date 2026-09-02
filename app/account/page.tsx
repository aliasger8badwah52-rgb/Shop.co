'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

/* ── Types ─────────────────────────────── */
interface UserProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  newsletter_subscribed: boolean
  sms_notifications: boolean
}

/* ── Skeleton loader ────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />
)

/* ── Toast ──────────────────────────────── */
function Toast({ message, type, onDone }: { message: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white font-semibold text-sm ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <i className={`fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-lg`} />
      {message}
    </motion.div>
  )
}

/* ── Field ──────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">{label}</label>
      {children}
    </div>
  )
}

/* ── Input ──────────────────────────────── */
function Input({ disabled, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      disabled={disabled}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      {...props}
    />
  )
}

/* ── Toggle ─────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
        checked ? 'bg-black' : 'bg-gray-200'
      }`}
    >
      <motion.span
        layout
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        animate={{ left: checked ? '1.5rem' : '0.25rem' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </button>
  )
}

/* ── StatusBadge ──────────────────────────── */
const statusMap: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Shipped:   'bg-blue-50 text-blue-700 border border-blue-200',
  Processing:'bg-amber-50 text-amber-700 border border-amber-200',
}

const mockOrders = [
  { id: 'ORD-2024-001', date: 'Jan 20, 2024', total: '$320.00', status: 'Delivered', items: 4 },
  { id: 'ORD-2023-002', date: 'Nov 2, 2023',  total: '$89.50',  status: 'Shipped',   items: 1 },
  { id: 'ORD-2023-001', date: 'Oct 15, 2023', total: '$145.00', status: 'Processing', items: 2 },
]

/* ── Page ────────────────────────────────── */
const TABS = [
  { id: 'profile',   icon: 'fa-regular fa-user',   label: 'Profile'  },
  { id: 'orders',    icon: 'fa-solid fa-box',       label: 'Orders'   },
  { id: 'wishlist',  icon: 'fa-regular fa-heart',   label: 'Wishlist' },
  { id: 'settings',  icon: 'fa-solid fa-sliders',   label: 'Settings' },
]

export default function AccountPage() {
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [draft, setDraft] = useState<Partial<UserProfile>>({})
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  /* Fetch from Neon */
  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user')
      if (!res.ok) throw new Error('Could not load profile.')
      const data: UserProfile = await res.json()
      setProfile(data)
      setDraft(data)
    } catch {
      setToast({ message: 'Failed to load profile from database.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  /* Save to Neon */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error('Save failed.')
      const updated = { ...profile, ...draft } as UserProfile
      setProfile(updated)
      setEditing(false)
      setToast({ message: 'Profile saved to database!', type: 'success' })
    } catch {
      setToast({ message: 'Failed to save. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setDraft(profile ?? {})
    setEditing(false)
  }

  const updateDraft = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#f8f8f8]">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-5">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Account</p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">
                {loading ? <Skeleton className="h-8 w-40" /> : `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-black select-none">
                {loading ? '' : (profile?.first_name?.[0] ?? 'U')}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-60 flex-shrink-0">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 sticky top-24">
                <nav className="flex flex-col gap-1">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        tab === t.id
                          ? 'bg-black text-white shadow-lg'
                          : 'text-gray-500 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      <i className={`${t.icon} w-4 text-center`} />
                      {t.label}
                    </button>
                  ))}
                </nav>

                <div className="h-px bg-gray-100 my-3 mx-1" />
                
                <div className="px-4 py-3 text-xs text-gray-400 space-y-1">
                  <p className="font-semibold text-gray-500">Connected to</p>
                  <p className="font-mono truncate text-[10px]">Neon DB ✓</p>
                </div>

                <div className="h-px bg-gray-100 my-1 mx-1" />

                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all w-full">
                  <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
                  Sign Out
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* ── PROFILE TAB ── */}
                  {tab === 'profile' && (
                    <form onSubmit={handleSave}>
                      {/* Tab header */}
                      <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                          <p className="text-sm text-gray-400 mt-0.5">Stored securely in your Neon database.</p>
                        </div>
                        {!editing && !loading && (
                          <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="text-sm font-bold border border-gray-200 px-5 py-2.5 rounded-full hover:border-black hover:bg-black hover:text-white transition-all"
                          >
                            Edit Profile
                          </button>
                        )}
                      </div>

                      <div className="p-8">
                        {loading ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-12 w-full" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            {/* Name section */}
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Full Name</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                              <Field label="First Name">
                                <Input type="text" value={draft.first_name ?? ''} onChange={updateDraft('first_name')} disabled={!editing} placeholder="First name" />
                              </Field>
                              <Field label="Last Name">
                                <Input type="text" value={draft.last_name ?? ''} onChange={updateDraft('last_name')} disabled={!editing} placeholder="Last name" />
                              </Field>
                            </div>

                            {/* Contact */}
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contact Details</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                              <Field label="Email Address">
                                <Input type="email" value={draft.email ?? ''} onChange={updateDraft('email')} disabled={!editing} placeholder="Email" />
                              </Field>
                              <Field label="Phone Number">
                                <Input type="tel" value={draft.phone ?? ''} onChange={updateDraft('phone')} disabled={!editing} placeholder="+1 (555) 000-0000" />
                              </Field>
                            </div>

                            {/* Shipping */}
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Shipping Address</p>
                            <div className="grid grid-cols-1 gap-5">
                              <Field label="Street Address">
                                <Input type="text" value={draft.address ?? ''} onChange={updateDraft('address')} disabled={!editing} placeholder="123 Main St" />
                              </Field>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                <Field label="City">
                                  <Input type="text" value={draft.city ?? ''} onChange={updateDraft('city')} disabled={!editing} placeholder="New York" />
                                </Field>
                                <Field label="State">
                                  <Input type="text" value={draft.state ?? ''} onChange={updateDraft('state')} disabled={!editing} placeholder="NY" />
                                </Field>
                                <Field label="ZIP Code">
                                  <Input type="text" value={draft.zip ?? ''} onChange={updateDraft('zip')} disabled={!editing} placeholder="10001" />
                                </Field>
                              </div>
                            </div>

                            {editing && (
                              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button type="button" onClick={cancelEdit} className="px-6 py-3 rounded-full font-semibold text-gray-500 hover:bg-gray-100 transition-all text-sm">
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={saving}
                                  className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-60 flex items-center gap-2 shadow-md shadow-black/20"
                                >
                                  {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-cloud-arrow-up" /> Save to Database</>}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </form>
                  )}

                  {/* ── ORDERS TAB ── */}
                  {tab === 'orders' && (
                    <div>
                      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold">Order History</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Track and manage your past purchases.</p>
                      </div>
                      <div className="p-8 flex flex-col gap-4">
                        {mockOrders.map((order) => (
                          <motion.div
                            key={order.id}
                            whileHover={{ x: 4 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-gray-100 rounded-2xl cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                <i className="fa-solid fa-box text-sm" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-sm text-gray-900">{order.id}</span>
                                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusMap[order.status]}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-black text-lg">{order.total}</span>
                              <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-black transition-colors text-sm" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="px-8 pb-8">
                        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                          <i className="fa-solid fa-arrow-left text-xs" /> Continue Shopping
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* ── WISHLIST TAB ── */}
                  {tab === 'wishlist' && (
                    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-5 shadow-inner"
                      >
                        <i className="fa-regular fa-heart text-4xl text-gray-200" />
                      </motion.div>
                      <h3 className="text-2xl font-black mb-2">Nothing saved yet</h3>
                      <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">Browse our catalog and tap the heart icon on any product to save it here for later.</p>
                      <Link href="/shop" className="bg-black text-white px-10 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/20 text-sm">
                        Explore Products
                      </Link>
                    </div>
                  )}

                  {/* ── SETTINGS TAB ── */}
                  {tab === 'settings' && (
                    <div>
                      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold">Preferences</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Control how Shop.co communicates with you.</p>
                      </div>
                      <div className="p-8 flex flex-col divide-y divide-gray-100">
                        {loading ? (
                          <div className="space-y-6">{[1,2].map(i => <div key={i} className="flex justify-between items-center py-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-6 w-12 rounded-full" /></div>)}</div>
                        ) : (
                          <>
                            {[
                              { key: 'newsletter_subscribed' as keyof UserProfile, label: 'Email Newsletter', desc: 'New arrivals, exclusive discounts, and style updates.', icon: 'fa-solid fa-envelope' },
                              { key: 'sms_notifications' as keyof UserProfile, label: 'SMS Notifications', desc: 'Order tracking and shipping alerts on your phone.', icon: 'fa-solid fa-mobile-screen' },
                            ].map(({ key, label, desc, icon }) => (
                              <div key={key} className="flex items-center justify-between py-5 first:pt-0">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                                    <i className={`${icon} text-sm`} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm text-gray-900">{label}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{desc}</p>
                                  </div>
                                </div>
                                <Toggle
                                  checked={!!draft[key]}
                                  onChange={async () => {
                                    const newVal = !draft[key]
                                    const updatedDraft = { ...draft, [key]: newVal }
                                    setDraft(updatedDraft)
                                    await fetch('/api/user', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify(updatedDraft),
                                    })
                                    setToast({ message: `${label} ${newVal ? 'enabled' : 'disabled'}.`, type: 'success' })
                                  }}
                                />
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
