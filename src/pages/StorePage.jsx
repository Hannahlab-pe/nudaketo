import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'
import TiltCard from '../components/effects/TiltCard'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
    <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
  </svg>
)
const IconCart = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)
const IconFilter = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" d="M3 6h18M7 12h10M11 18h2"/>
  </svg>
)

const sortOptions = [
  { id: 'relevance', label: 'Relevancia' },
  { id: 'price-asc', label: 'Precio: menor a mayor' },
  { id: 'price-desc', label: 'Precio: mayor a menor' },
  { id: 'name', label: 'Nombre A–Z' },
]

const priceRanges = [
  { id: 'all', label: 'Todos los precios' },
  { id: 'low', label: 'Hasta S/10', min: 0, max: 10 },
  { id: 'mid', label: 'S/10 – S/30', min: 10, max: 30 },
]

function ProductStoreCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  // Agrega la presentación cuyo precio se muestra ("Desde S/…"), la más barata
  const defaultSize = product.sizes.reduce((min, s) => (s.price < min.price ? s : min), product.sizes[0])

  const handleAdd = (e) => {
    e.preventDefault()
    addItem({ id: product.id, sizeId: defaultSize.id, name: product.name, sizeLabel: defaultSize.label, size: defaultSize.size, price: defaultSize.price, qty: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const minPrice = Math.min(...product.sizes.map(s => s.price))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <TiltCard className="h-full" max={5}>
        <div className={`group rounded-2xl overflow-hidden border border-nk-arena hover:border-nk-gold/50 transition-all duration-400 hover:shadow-[0_12px_40px_rgba(75,53,39,0.12)] ${product.cardBg} flex flex-col h-full`}>
          {/* Imagen */}
          <Link to={`/producto/${product.slug}`} className="block overflow-hidden aspect-4/3 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-nk-choco text-nk-ivory text-[9px] font-black px-2.5 py-1 rounded-full"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {product.badge}
              </span>
            )}
          </Link>

          {/* Info */}
          <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className={`text-[9px] tracking-[3px] mb-1 ${product.accentClass}`} style={{ fontFamily: "'DM Mono', monospace" }}>
            {product.tagline}
          </p>
          <Link to={`/producto/${product.slug}`}>
            <h3 className="text-base font-bold text-nk-choco leading-snug hover:text-nk-gold transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-nk-muted text-xs leading-relaxed line-clamp-2">{product.shortDesc}</p>

        <div className="flex-1" />

        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-[10px] text-nk-muted">Desde</span>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco leading-none">
              S/{minPrice.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-300 hover:scale-[1.03] ${
                added ? 'bg-nk-olive text-nk-ivory' : product.btnClass
              }`}
            >
              {added ? <IconCheck /> : <IconCart />}
              {added ? 'Listo' : 'Agregar'}
            </button>

            <Link
              to={`/producto/${product.slug}`}
              className="flex items-center justify-center w-9 h-9 rounded-xl border-2 border-nk-arena hover:border-nk-choco text-nk-muted hover:text-nk-choco transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          </div>
        </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function StorePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sort, setSort] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef(null)

  const filtered = useMemo(() => {
    let list = [...products]

    // Búsqueda
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }

    // Categoría
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory)
    }

    // Precio
    if (priceRange !== 'all') {
      const range = priceRanges.find(r => r.id === priceRange)
      if (range) {
        list = list.filter(p => {
          const min = Math.min(...p.sizes.map(s => s.price))
          return min >= range.min && min <= range.max
        })
      }
    }

    // Orden
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => Math.min(...a.sizes.map(s => s.price)) - Math.min(...b.sizes.map(s => s.price)))
        break
      case 'price-desc':
        list.sort((a, b) => Math.min(...b.sizes.map(s => s.price)) - Math.min(...a.sizes.map(s => s.price)))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        break
      default:
        break
    }

    return list
  }, [query, activeCategory, priceRange, sort])

  const hasFilters = query || activeCategory !== 'all' || priceRange !== 'all' || sort !== 'relevance'

  const clearAll = () => {
    setQuery('')
    setActiveCategory('all')
    setPriceRange('all')
    setSort('relevance')
  }

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />

      {/* Hero banner */}
      <div className="bg-nk-choco py-12 px-5 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[4px] mb-2">NUDA KETO</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-black text-nk-ivory leading-tight mb-3">
            Nuestra <span className="italic text-nk-gold">Tienda</span>
          </h1>
          <p className="text-nk-ivory/55 text-sm">
            {products.length} productos · Sin azúcar añadida · Gluten free · Keto
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8">

        {/* Barra de búsqueda + filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-nk-muted pointer-events-none">
              <IconSearch />
            </span>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar galletones, barras, bites..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm placeholder:text-nk-arena transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-nk-muted hover:text-nk-choco"
              >
                <IconX />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3.5 rounded-2xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm appearance-none cursor-pointer min-w-44"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {sortOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>

          {/* Toggle filtros mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`sm:hidden flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 font-medium text-sm transition-colors ${
              showFilters ? 'border-nk-choco bg-nk-choco text-nk-ivory' : 'border-nk-arena bg-white text-nk-muted'
            }`}
          >
            <IconFilter />
            Filtros
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-nk-gold" />}
          </button>
        </div>

        <div className="flex gap-6">

          {/* Sidebar de filtros — desktop siempre visible, mobile toggle */}
          <AnimatePresence>
            {(showFilters || true) && (
              <motion.aside
                initial={false}
                className="hidden sm:flex flex-col gap-6 w-56 shrink-0"
              >
                {/* Categorías */}
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">CATEGORÍA</p>
                  <div className="flex flex-col gap-1">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                          activeCategory === cat.id
                            ? 'bg-nk-choco text-nk-ivory'
                            : 'text-nk-muted hover:bg-nk-arena/30 hover:text-nk-choco'
                        }`}
                      >
                        {cat.label}
                        <span className="text-[10px] opacity-60">
                          {cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">PRECIO</p>
                  <div className="flex flex-col gap-1">
                    {priceRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setPriceRange(range.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                          priceRange === range.id
                            ? 'bg-nk-choco text-nk-ivory font-medium'
                            : 'text-nk-muted hover:bg-nk-arena/30 hover:text-nk-choco'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          priceRange === range.id ? 'border-nk-gold bg-nk-gold' : 'border-nk-arena'
                        }`}>
                          {priceRange === range.id && <span className="w-1.5 h-1.5 rounded-full bg-nk-ivory" />}
                        </span>
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limpiar filtros */}
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 text-nk-muted hover:text-nk-choco text-xs transition-colors"
                  >
                    <IconX />
                    Limpiar filtros
                  </button>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Filtros mobile desplegables */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="sm:hidden overflow-hidden w-full mb-4"
              />
            )}
          </AnimatePresence>

          {/* Grid de productos */}
          <div className="flex-1 min-w-0">

            {/* Filtros mobile pills */}
            <div className="sm:hidden flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-nk-choco border-nk-choco text-nk-ivory'
                      : 'border-nk-arena text-nk-muted'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {priceRanges.slice(1).map(range => (
                <button
                  key={range.id}
                  onClick={() => setPriceRange(priceRange === range.id ? 'all' : range.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    priceRange === range.id
                      ? 'bg-nk-gold border-nk-gold text-nk-ivory'
                      : 'border-nk-arena text-nk-muted'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Conteo + activos */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-nk-muted text-sm">
                <span className="text-nk-choco font-semibold">{filtered.length}</span> de {products.length} productos
              </p>
              {hasFilters && (
                <button onClick={clearAll} className="text-nk-muted text-xs hover:text-nk-choco flex items-center gap-1 transition-colors">
                  <IconX /> Limpiar
                </button>
              )}
            </div>

            {/* Resultados */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-nk-arena/40 flex items-center justify-center">
                  <IconSearch />
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-nk-choco">
                  Sin resultados
                </p>
                <p className="text-nk-muted text-sm">Prueba con otro término o{' '}
                  <button onClick={clearAll} className="text-nk-gold underline">limpia los filtros</button>
                </p>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map(product => (
                    <ProductStoreCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
