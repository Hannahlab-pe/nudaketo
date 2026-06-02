import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { getProductBySlug, products } from '../data/products'
import { useCart } from '../context/CartContext'

const IconArrow = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
)
const IconCart = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
)

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-nk-ivory flex items-center justify-center flex-col gap-4 px-5">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-xl font-bold text-center">
          Producto no encontrado
        </p>
        <Link to="/" className="text-nk-gold underline text-sm">Volver al inicio</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      sizeId: selectedSize.id,
      name: product.name,
      sizeLabel: selectedSize.label,
      size: selectedSize.size,
      price: selectedSize.price,
      qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const related = products.filter((p) => p.id !== product.id)

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 sm:mb-10" style={{ fontFamily: "'DM Mono', monospace" }}>
          <Link to="/" className="text-nk-muted text-xs tracking-wider hover:text-nk-choco transition-colors flex items-center gap-1.5">
            <IconArrow />
            Inicio
          </Link>
          <span className="text-nk-arena">·</span>
          <span className="text-nk-gold text-xs tracking-wider truncate max-w-45 sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20">

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-nk-arena bg-linear-to-br from-[#FEFCF8] to-[#F0E8D8] flex flex-col items-center justify-center gap-4 sm:gap-6 shadow-[0_8px_40px_rgba(75,53,39,0.1)]">
              <div className="w-28 sm:w-40 h-28 sm:h-40 rounded-full border-2 border-nk-gold flex flex-col items-center justify-center bg-white shadow-md">
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-nk-choco text-lg sm:text-2xl leading-none">NUDA</span>
                <div className="w-10 sm:w-14 h-px bg-nk-gold my-1" />
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[8px] sm:text-[10px] tracking-[4px]">KETO</span>
              </div>

              <div className="text-center px-4 sm:px-8">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-base sm:text-xl font-bold leading-snug">
                  {product.name}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] sm:text-xs mt-1.5 tracking-wider">
                  {selectedSize?.size} · {selectedSize?.pieces}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center px-4">
                {['SIN AZÚCAR', 'GLUTEN FREE', 'KETO'].map((b) => (
                  <span key={b} style={{ fontFamily: "'DM Mono', monospace" }} className="border border-nk-choco text-nk-choco text-[7px] sm:text-[8px] tracking-[1px] px-2 py-1 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {product.badge && (
              <div className="absolute top-4 left-4 bg-nk-choco text-nk-ivory text-[10px] font-black px-3 py-1.5 rounded-full"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {product.badge}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 sm:gap-7"
          >
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace" }} className={`text-[10px] sm:text-xs tracking-[3px] mb-2 ${product.accentClass}`}>
                {product.tagline}
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl lg:text-4xl font-black text-nk-choco leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-nk-muted text-sm sm:text-base leading-relaxed">{product.description}</p>

            {/* Selector de tamaño */}
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] sm:text-xs tracking-[3px] mb-2 sm:mb-3">
                PRESENTACIÓN
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 text-left transition-all duration-200 ${
                      selectedSize?.id === s.id
                        ? 'border-nk-gold bg-nk-gold/5'
                        : 'border-nk-arena hover:border-nk-gold/50 bg-white'
                    }`}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace" }} className={`text-[9px] sm:text-[10px] tracking-[2px] ${selectedSize?.id === s.id ? 'text-nk-gold' : 'text-nk-muted'}`}>
                      {s.label}
                    </span>
                    <p className="text-nk-muted text-xs mt-0.5">{s.pieces} · {s.size}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-lg sm:text-xl font-black mt-1">
                      S/{s.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad + Agregar */}
            <div className="flex gap-3">
              <div className="flex items-center gap-2 sm:gap-3 border-2 border-nk-arena rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 shrink-0">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-nk-muted hover:text-nk-choco transition-colors w-5 h-5 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M5 12h14"/></svg>
                </button>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold text-lg w-5 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="text-nk-muted hover:text-nk-choco transition-colors w-5 h-5 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  added ? 'bg-nk-olive text-nk-ivory' : 'bg-nk-choco hover:bg-nk-gold text-nk-ivory'
                }`}
              >
                {added ? <><IconCheck />Agregado</> : <><IconCart />Agregar — S/{(selectedSize?.price * qty).toFixed(2)}</>}
              </button>
            </div>

            {/* Highlights */}
            <div className="border-t border-nk-arena pt-5 sm:pt-6">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] sm:text-xs tracking-[3px] mb-3 sm:mb-4">
                CARACTERÍSTICAS
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-nk-muted text-xs sm:text-sm">
                    <span className={`mt-0.5 shrink-0 ${product.accentClass}`}><IconCheck /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Info packaging */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: 'Presentación', value: product.packaging },
                { label: 'Peso neto', value: product.netWeight },
                { label: 'Proteína', value: product.protein },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg sm:rounded-xl border border-nk-arena p-2.5 sm:p-3 bg-white text-center">
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[8px] sm:text-[9px] tracking-wider mb-1">{label.toUpperCase()}</p>
                  <p className="text-nk-choco text-[10px] sm:text-xs font-semibold leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Relacionados */}
        <div className="mt-14 sm:mt-20">
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] sm:text-xs tracking-[4px] mb-2 sm:mb-3">TAMBIÉN TE PUEDE GUSTAR</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl font-black text-nk-choco mb-6 sm:mb-8">
            Otros <span className="italic text-nk-gold">productos</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/producto/${p.slug}`}
                className="flex gap-4 items-center p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-nk-arena bg-white hover:border-nk-gold/40 hover:shadow-[0_4px_20px_rgba(75,53,39,0.08)] transition-all group"
              >
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-nk-arena/30 border border-nk-arena shrink-0 flex items-center justify-center">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-gold font-bold text-xl">
                    {p.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className={`text-[9px] sm:text-[10px] tracking-[2px] ${p.accentClass}`}>{p.tagline}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold text-sm sm:text-base leading-snug mt-0.5">{p.name}</p>
                  <p className="text-nk-gold text-sm font-semibold mt-1">Desde S/{Math.min(...p.sizes.map(s => s.price)).toFixed(2)}</p>
                </div>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-nk-muted stroke-2 shrink-0 group-hover:stroke-nk-gold transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
