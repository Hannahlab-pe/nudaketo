import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { getProductBySlug, products } from '../data/products'
import { useCart } from '../context/CartContext'

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
  )
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
    </svg>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = getProductBySlug(slug)
  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-nk-ivory flex items-center justify-center flex-col gap-4">
        <p className="text-nk-choco text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
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
      {/* Spacer para navbar fija */}
      <div className="h-20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10" style={{ fontFamily: "'DM Mono', monospace" }}>
          <Link to="/" className="text-nk-muted text-xs tracking-wider hover:text-nk-choco transition-colors flex items-center gap-1.5">
            <IconArrow />
            Inicio
          </Link>
          <span className="text-nk-arena">·</span>
          <span className="text-nk-gold text-xs tracking-wider truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Imagen del producto (placeholder premium) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-nk-arena bg-gradient-to-br from-[#FEFCF8] to-[#F0E8D8] flex flex-col items-center justify-center gap-6 shadow-[0_8px_40px_rgba(75,53,39,0.1)]">
              {/* Packaging mock */}
              <div className="w-40 h-40 rounded-full border-2 border-nk-gold flex flex-col items-center justify-center bg-white shadow-md">
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-nk-choco text-2xl leading-none">NUDA</span>
                <div className="w-14 h-px bg-nk-gold my-1" />
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[4px]">KETO</span>
              </div>
              <div className="text-center px-8">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-xl font-bold leading-snug">
                  {product.name}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-xs mt-2 tracking-wider">
                  {selectedSize?.size} · {selectedSize?.pieces}
                </p>
              </div>

              {/* Badges */}
              <div className="flex gap-3">
                {['SIN AZÚCAR', 'GLUTEN FREE', 'KETO'].map((b) => (
                  <span key={b} style={{ fontFamily: "'DM Mono', monospace" }} className="border border-nk-choco text-nk-choco text-[8px] tracking-[1px] px-2 py-1 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {product.badge && (
              <div className="absolute top-5 left-5 bg-nk-choco text-nk-ivory text-[10px] font-black px-3 py-1.5 rounded-full"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {product.badge}
              </div>
            )}
          </motion.div>

          {/* Info del producto */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-7"
          >
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace" }} className={`text-xs tracking-[3px] mb-2 ${product.accentClass}`}>
                {product.tagline}
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl lg:text-4xl font-black text-nk-choco leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-nk-muted text-base leading-relaxed">{product.description}</p>

            {/* Selector de tamaño */}
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-xs tracking-[3px] mb-3">
                PRESENTACIÓN
              </p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 min-w-[130px] rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      selectedSize?.id === s.id
                        ? 'border-nk-gold bg-nk-gold/5'
                        : 'border-nk-arena hover:border-nk-gold/50 bg-white'
                    }`}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace" }} className={`text-[10px] tracking-[2px] ${selectedSize?.id === s.id ? 'text-nk-gold' : 'text-nk-muted'}`}>
                      {s.label}
                    </span>
                    <p className="text-nk-muted text-xs mt-0.5">{s.pieces} · {s.size}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-xl font-black mt-1">
                      S/{s.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad + Agregar */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-2 border-nk-arena rounded-2xl px-4 py-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-nk-muted hover:text-nk-choco transition-colors w-5 h-5 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M5 12h14"/></svg>
                </button>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold text-lg w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="text-nk-muted hover:text-nk-choco transition-colors w-5 h-5 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  added
                    ? 'bg-nk-olive text-nk-ivory'
                    : 'bg-nk-choco hover:bg-nk-gold text-nk-ivory'
                }`}
              >
                {added ? (
                  <>
                    <IconCheck />
                    Agregado al carrito
                  </>
                ) : (
                  <>
                    <IconCart />
                    Agregar al carrito — S/{(selectedSize?.price * qty).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Highlights */}
            <div className="border-t border-nk-arena pt-6">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-xs tracking-[3px] mb-4">
                CARACTERÍSTICAS
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((h) => (
                  <li key={h} className={`flex items-start gap-2 text-nk-muted text-sm`}>
                    <span className={`mt-0.5 ${product.accentClass}`}><IconCheck /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Info packaging */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Presentación', value: product.packaging },
                { label: 'Peso neto', value: product.netWeight },
                { label: 'Proteína', value: product.protein },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-nk-arena p-3 bg-white text-center">
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[9px] tracking-wider mb-1">{label.toUpperCase()}</p>
                  <p className="text-nk-choco text-xs font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Productos relacionados */}
        <div className="mt-20">
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-xs tracking-[4px] mb-3">TAMBIÉN TE PUEDE GUSTAR</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco mb-8">
            Otros <span className="italic text-nk-gold">productos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/producto/${p.slug}`}
                className="flex gap-5 items-center p-5 rounded-2xl border border-nk-arena bg-white hover:border-nk-gold/40 hover:shadow-[0_4px_20px_rgba(75,53,39,0.08)] transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-nk-arena/30 border border-nk-arena shrink-0 flex items-center justify-center">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-gold font-bold text-xl">
                    {p.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className={`text-[10px] tracking-[2px] ${p.accentClass}`}>{p.tagline}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold text-base leading-snug mt-0.5">{p.name}</p>
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
