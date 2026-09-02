'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { allProducts as catalogProducts, type Product as CatalogProduct } from '@/lib/products'

/* ─── Local Product type (includes dashboard fields) ─── */
interface Product {
  id: number
  name: string
  slug: string
  category: string
  price: string
  priceNum: number
  originalPrice: string
  discount: string
  rating: number
  stock: number
  status: 'Active' | 'Draft' | 'Out of Stock'
  image: string
  description: string
  brand: string
  createdAt: string
}

/* ─── Map catalog products to dashboard-compatible shape ─ */
const initialProducts: Product[] = catalogProducts.map((p: CatalogProduct) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  price: p.price,
  priceNum: p.priceNum,
  originalPrice: p.originalPrice,
  discount: p.discount,
  rating: p.rating,
  stock: p.stock,
  status: p.status,
  image: p.image,
  description: p.description,
  brand: p.brand,
  createdAt: p.createdAt,
}))

const categories = ['T-Shirts', 'Shirts', 'Jeans', 'Shorts', 'Dresses', 'Pants', 'Jackets', 'Hoodies', 'Skirts', 'Tops']

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '', slug: '', category: 'T-Shirts', price: '', priceNum: 0, originalPrice: '',
  discount: '', rating: 4.0, stock: 0, status: 'Active',
  image: '', description: '', brand: 'Shop.co',
}

/* ─── Nav Items ──────────────────────────────────────── */
const navItems = [
  { id: 'overview', label: 'Overview', icon: 'fa-solid fa-chart-pie' },
  { id: 'products', label: 'Products', icon: 'fa-solid fa-box' },
  { id: 'orders', label: 'Orders', icon: 'fa-solid fa-bag-shopping' },
  { id: 'customers', label: 'Customers', icon: 'fa-solid fa-users' },
  { id: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-line' },
  { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
]

/* ─── Stat Card ──────────────────────────────────────── */
function StatCard({ icon, label, value, change, color }: { icon: string; label: string; value: string; change: string; color: string }) {
  const positive = change.startsWith('+')
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#888', fontSize: 13, fontWeight: 500, margin: '0 0 6px' }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#111', letterSpacing: '-0.5px' }}>{value}</p>
          <p style={{ fontSize: 12, margin: '6px 0 0', color: positive ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
            <i className={`fa-solid ${positive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} style={{ marginRight: 4 }} />
            {change} vs last month
          </p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={icon} style={{ color: '#fff', fontSize: 20 }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Status Badge ───────────────────────────────────── */
function StatusBadge({ status }: { status: Product['status'] }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Active': { bg: '#dcfce7', color: '#16a34a' },
    'Draft': { bg: '#fef9c3', color: '#a16207' },
    'Out of Stock': { bg: '#fee2e2', color: '#dc2626' },
  }
  const s = map[status]
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: 0.5 }}>
      {status}
    </span>
  )
}

/* ─── Stars ──────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#eab308', fontSize: 12 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#888', fontSize: 11, marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

/* ─── Modal ──────────────────────────────────────────── */
function ProductModal({
  product,
  onClose,
  onSave,
  isNew,
}: {
  product: Omit<Product, 'id' | 'createdAt'>
  onClose: () => void
  onSave: (p: Omit<Product, 'id' | 'createdAt'>) => void
  isNew: boolean
}) {
  const [form, setForm] = useState({ ...product })

  const set = (key: keyof typeof form, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Modal Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', borderRadius: '20px 20px 0 0', zIndex: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111' }}>{isNew ? '✨ Add New Product' : '✏️ Edit Product'}</h2>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>{isNew ? 'Fill in the details to list a new product' : 'Update product information below'}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Image Preview */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 100, height: 100, borderRadius: 12, background: '#f3f4f6', overflow: 'hidden', flexShrink: 0, border: '2px dashed #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {form.image
                  ? <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <i className="fa-solid fa-image" style={{ color: '#ccc', fontSize: 28 }} />
                }
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Image URL</label>
                <input
                  style={inputStyle}
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#aaa' }}>Paste any direct image URL (Unsplash, CDN, etc.)</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Product Name *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Classic White T-Shirt" />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>Slug *</label>
            <input style={inputStyle} value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="classic-white-t-shirt" />
          </div>

          {/* Brand */}
          <div>
            <label style={labelStyle}>Brand</label>
            <input style={inputStyle} value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Shop.co" />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={(e) => set('status', e.target.value as Product['status'])}>
              {['Active', 'Draft', 'Out of Stock'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>Sale Price *</label>
            <input style={inputStyle} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="$120" />
          </div>

          {/* Original Price */}
          <div>
            <label style={labelStyle}>Original Price (optional)</label>
            <input style={inputStyle} value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} placeholder="$150" />
          </div>

          {/* Discount */}
          <div>
            <label style={labelStyle}>Discount Label</label>
            <input style={inputStyle} value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="-20%" />
          </div>

          {/* Stock */}
          <div>
            <label style={labelStyle}>Stock Count</label>
            <input type="number" style={inputStyle} value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} min={0} />
          </div>

          {/* Rating */}
          <div>
            <label style={labelStyle}>Rating (0-5)</label>
            <input type="number" style={inputStyle} value={form.rating} onChange={(e) => set('rating', Number(e.target.value))} min={0} max={5} step={0.1} />
          </div>

          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Write a short product description..."
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.name || !form.slug || !form.price) {
                alert('Please fill in Name, Slug, and Price.')
                return
              }
              onSave(form)
            }}
            style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #111 0%, #333 100%)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}
          >
            {isNew ? '+ Add Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─────────────────────────────────── */
export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const nextId = useRef(products.length + 1)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const handleAddProduct = (formData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...formData,
      id: nextId.current++,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setProducts((prev) => [newProduct, ...prev])
    setModalOpen(false)
    showToast(`"${newProduct.name}" added successfully!`)
  }

  const handleEditProduct = (formData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!editingProduct) return
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
    )
    setEditingProduct(null)
    showToast(`"${formData.name}" updated successfully!`)
  }

  const handleDelete = (id: number) => {
    const p = products.find((p) => p.id === id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirmId(null)
    if (p) showToast(`"${p.name}" deleted.`, 'error')
  }

  /* ─── Sidebar ──────────────────────────────────────── */
  const Sidebar = () => (
    <aside style={{
      width: sidebarOpen ? 240 : 68,
      background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      zIndex: 100,
      boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="fa-solid fa-shirt" style={{ color: '#111', fontSize: 16 }} />
        </div>
        {sidebarOpen && (
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: '-0.3px', lineHeight: 1 }}>SHOP.CO</div>
            <div style={{ color: '#666', fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Admin</div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} style={{ fontSize: 11 }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {navItems.map((item) => {
          const active = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as typeof activeSection)}
              title={!sidebarOpen ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 12px',
                marginBottom: 2, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: active ? '#fff' : '#666',
                fontSize: 14, fontWeight: active ? 700 : 500,
                textAlign: 'left', transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = 'rgba(255,255,255,0.06)') }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = 'transparent') }}
            >
              <i className={item.icon} style={{ fontSize: 15, flexShrink: 0, width: 18, textAlign: 'center' }} />
              {sidebarOpen && item.label}
              {sidebarOpen && active && (
                <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', color: '#666', fontSize: 13, textDecoration: 'none', borderRadius: 10 }}
        >
          <i className="fa-solid fa-arrow-left" style={{ width: 18, textAlign: 'center' }} />
          {sidebarOpen && 'Back to Store'}
        </Link>
      </div>
    </aside>
  )

  /* ─── Overview Section ─────────────────────────────── */
  const OverviewSection = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111' }}>Welcome back! 👋</h1>
        <p style={{ margin: '6px 0 0', color: '#888', fontSize: 14 }}>Here's what's happening with your store today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="fa-solid fa-dollar-sign" label="Total Revenue" value="$84,290" change="+12.4%" color="#6366f1" />
        <StatCard icon="fa-solid fa-bag-shopping" label="Total Orders" value="1,284" change="+8.1%" color="#f59e0b" />
        <StatCard icon="fa-solid fa-box" label="Products" value={String(products.length)} change="+2" color="#10b981" />
        <StatCard icon="fa-solid fa-users" label="Customers" value="5,420" change="+3.7%" color="#3b82f6" />
      </div>

      {/* Recent Products + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Recent Products Table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Recent Products</h3>
            <button onClick={() => setActiveSection('products')} style={{ fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {products.slice(0, 6).map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#f3f4f6' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                      <div style={{ color: '#888', fontSize: 12 }}>{p.category}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', fontWeight: 700, color: '#111', textAlign: 'right' }}>{p.price}</td>
                  <td style={{ padding: '12px 24px', textAlign: 'right' }}><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: 16, padding: 20, color: '#fff', cursor: 'pointer' }} onClick={() => { setModalOpen(true); setEditingProduct(null) }}>
            <i className="fa-solid fa-plus" style={{ fontSize: 22, marginBottom: 10, display: 'block' }} />
            <div style={{ fontWeight: 800, fontSize: 15 }}>Add New Product</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>List a new item in your catalog</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Inventory Status</div>
            {[
              { label: 'Active', count: products.filter((p) => p.status === 'Active').length, color: '#10b981' },
              { label: 'Draft', count: products.filter((p) => p.status === 'Draft').length, color: '#f59e0b' },
              { label: 'Out of Stock', count: products.filter((p) => p.status === 'Out of Stock').length, color: '#ef4444' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 13, color: '#555' }}>{s.label}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{s.count}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Top Category</div>
            {['T-Shirts', 'Jeans', 'Shirts'].map((cat) => {
              const count = products.filter((p) => p.category === cat).length
              const max = Math.max(...categories.map((c) => products.filter((p) => p.category === c).length), 1)
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: '#888' }}>{count}</span>
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: 999, height: 6 }}>
                    <div style={{ background: '#6366f1', borderRadius: 999, height: 6, width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  /* ─── Products Section ─────────────────────────────── */
  const ProductsSection = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111' }}>Products</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>{filteredProducts.length} of {products.length} products</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setModalOpen(true) }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #111 0%, #333 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
        >
          <i className="fa-solid fa-plus" /> Add Product
        </button>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 13 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>
        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
        >
          <option>All</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
        >
          <option>All</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '13px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#888', textAlign: h === 'Actions' ? 'center' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
                  <i className="fa-solid fa-box-open" style={{ fontSize: 32, display: 'block', marginBottom: 12 }} />
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: idx < filteredProducts.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Product col */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                        {p.image
                          ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-image" style={{ color: '#ccc' }} /></div>
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#111', maxWidth: 200 }}>{p.name}</div>
                        <div style={{ color: '#aaa', fontSize: 11, marginTop: 2 }}>/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>
                    <span style={{ background: '#f3f4f6', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{p.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>{p.price}</div>
                    {p.originalPrice && <div style={{ color: '#bbb', fontSize: 11, textDecoration: 'line-through' }}>{p.originalPrice}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: p.stock === 0 ? '#ef4444' : p.stock < 20 ? '#f59e0b' : '#111' }}>
                    {p.stock === 0 ? '—' : p.stock}
                  </td>
                  <td style={{ padding: '14px 16px' }}><Stars rating={p.rating} /></td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button
                        onClick={() => setEditingProduct(p)}
                        title="Edit"
                        style={{ background: '#f0f4ff', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <i className="fa-solid fa-pen" style={{ fontSize: 12 }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        title="Delete"
                        style={{ background: '#fff0f0', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <i className="fa-solid fa-trash" style={{ fontSize: 12 }} />
                      </button>
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        title="View on store"
                        style={{ background: '#f0fdf4', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 11 }} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  /* ─── Placeholder section ──────────────────────────── */
  const PlaceholderSection = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#aaa' }}>
      <i className="fa-solid fa-wrench" style={{ fontSize: 40, marginBottom: 16 }} />
      <h2 style={{ margin: '0 0 8px', color: '#555', fontWeight: 700 }}>{label}</h2>
      <p style={{ margin: 0, fontSize: 14 }}>This section is coming soon.</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 68, transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, color: '#888' }}>
            <span style={{ color: '#6366f1', fontWeight: 700 }}>Dashboard</span>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#111', fontWeight: 600, textTransform: 'capitalize' }}>{activeSection}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{ background: '#f3f4f6', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <i className="fa-solid fa-bell" style={{ color: '#555', fontSize: 14 }} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }} />
            </button>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>A</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '28px 28px' }}>
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'orders' && <PlaceholderSection label="Orders Management" />}
          {activeSection === 'customers' && <PlaceholderSection label="Customer Management" />}
          {activeSection === 'analytics' && <PlaceholderSection label="Analytics & Reports" />}
          {activeSection === 'settings' && <PlaceholderSection label="Store Settings" />}
        </div>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <ProductModal
          product={emptyProduct}
          onClose={() => setModalOpen(false)}
          onSave={handleAddProduct}
          isNew={true}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductModal
          product={{
            name: editingProduct.name, slug: editingProduct.slug, category: editingProduct.category,
            price: editingProduct.price, priceNum: editingProduct.priceNum, originalPrice: editingProduct.originalPrice, discount: editingProduct.discount,
            rating: editingProduct.rating, stock: editingProduct.stock, status: editingProduct.status,
            image: editingProduct.image, description: editingProduct.description, brand: editingProduct.brand,
          }}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditProduct}
          isNew={false}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirmId !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 60, height: 60, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="fa-solid fa-trash" style={{ color: '#ef4444', fontSize: 22 }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800 }}>Delete Product?</h3>
            <p style={{ margin: '0 0 24px', color: '#888', fontSize: 14 }}>This action cannot be undone. The product will be permanently removed from your catalog.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ padding: '10px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId!)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: toast.type === 'success' ? '#111' : '#ef4444',
          color: '#fff', borderRadius: 12, padding: '13px 20px', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 2000, animation: 'slideIn 0.3s ease',
        }}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`} />
          {toast.msg}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 999px; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
