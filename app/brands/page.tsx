export default function BrandsPage() {
  const featuredBrands = [
    { id: 1, name: 'VERSACE', tagline: 'Iconic Italian luxury', founded: '1978', emoji: '👑', color: '#FFD700' },
    { id: 2, name: 'ZARA', tagline: 'Fast fashion, timeless style', founded: '1975', emoji: '🛍️', color: '#222' },
    { id: 3, name: 'GUCCI', tagline: 'The epitome of Italian craft', founded: '1921', emoji: '🌿', color: '#2D5F2D' },
    { id: 4, name: 'PRADA', tagline: 'Minimalist modern luxury', founded: '1913', emoji: '🔺', color: '#000080' },
    { id: 5, name: 'Calvin Klein', tagline: 'American minimalism', founded: '1968', emoji: '⬜', color: '#555' },
    { id: 6, name: 'H&M', tagline: 'Fashion for everyone', founded: '1947', emoji: '🎯', color: '#CC0000' },
    { id: 7, name: 'Levi\'s', tagline: 'Denim since 1853', founded: '1853', emoji: '👖', color: '#1A237E' },
    { id: 8, name: 'Ralph Lauren', tagline: 'Preppy American classics', founded: '1967', emoji: '🏇', color: '#1B3A6B' },
  ]

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Our Partners
          </span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
            All Brands
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-base">
            Explore the world's finest fashion brands — all in one place.
          </p>
        </div>

        {/* Brand logos strip */}
        <div className="bg-black rounded-3xl py-8 px-10 mb-16 flex flex-wrap justify-center md:justify-between items-center gap-6">
          {['VERSACE', 'Zara', 'GUCCI', 'PRADA', 'Calvin Klein'].map((b) => (
            <span key={b} className="text-white font-extrabold text-xl md:text-2xl tracking-widest opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              {b}
            </span>
          ))}
        </div>

        {/* Brands grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBrands.map((brand) => (
            <div
              key={brand.id}
              className="group border border-gray-200 rounded-2xl p-6 hover:border-black hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: brand.color + '20' }}
              >
                {brand.emoji}
              </div>
              <h3 className="font-black text-lg text-black uppercase tracking-wide mb-1">{brand.name}</h3>
              <p className="text-gray-500 text-sm mb-3">{brand.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Est. {brand.founded}</span>
                <a
                  href={`/shop?brand=${brand.name.toLowerCase().replace(' ', '-')}`}
                  className="text-xs font-semibold text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  Shop Now →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-[#F2F0F1] rounded-3xl py-14 px-8">
          <h2 className="text-3xl font-black uppercase text-black mb-3">Can't Find Your Brand?</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            We're constantly adding new brands. Let us know which one you'd like to see!
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-black text-white rounded-full px-8 py-3 font-semibold hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-paper-plane text-sm" />
            Request a Brand
          </a>
        </div>
      </div>
    </main>
  )
}
