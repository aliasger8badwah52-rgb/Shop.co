import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard — SHOP.CO',
  description: 'Manage your store products, orders, and more.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
