import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

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
const IconArrow = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
)

function ProductCard({ product, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const defaultSize = product.sizes[0]

  const handleAdd = (e) => {
    e.preventDefault()
    addItem({
      id: product.id,
      sizeId: defaultSize.id,
      name: product.name,
      sizeLabel: defaultSize.label,
      size: defaultSize.size,
      price: defaultSize.price,
      qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-nk-arena hover:border-nk-gold/50 transition-all duration-500 hover:shadow-[0_16px_50px_rgba(75,53,39,0.12)] ${product.cardBg} flex flex-col`}
    >
      {product.badge && (
        <div className="absolute top-3 right-3 z-10 text-[10px] font-black px-2.5 py-1.5 rounded-full bg-nk-choco text-nk-ivory"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          {product.badge}
        </div>
      )}

      {/* Imagen real del producto */}
      <Link to={`/producto/${product.slug}`} className="block overflow-hidden aspect-4/3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
        {/* Encabezado */}
        <div>
          <p className={`text-[10px] tracking-[3px] mb-1.5 ${product.accentClass}`} style={{ fontFamily: "'DM Mono', monospace" }}>
            {product.tagline}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-nk-choco leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h3>
        </div>

        <p className="text-nk-muted text-xs sm:text-sm leading-relaxed">{product.shortDesc}</p>

        {/* Highlights */}
        <ul className="flex flex-col gap-1.5">
          {product.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-center gap-2 text-nk-muted text-xs sm:text-sm">
              <svg viewBox="0 0 24 24" className={`w-3 h-3 fill-none stroke-current stroke-2 shrink-0 ${product.accentClass}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {h}
            </li>
          ))}
        </ul>

        <div className="flex-1" />
        <div className="w-full h-px bg-nk-arena/60" />

        {/* Precios */}
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <div key={s.id} className="flex-1 min-w-24 rounded-xl border border-nk-arena p-3 flex flex-col gap-0.5 bg-nk-ivory/60">
              <span className={`text-[9px] tracking-[2px] ${product.accentClass}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                {s.label}
              </span>
              <span className="text-nk-muted text-[10px]">{s.pieces}</span>
              <span className="text-nk-choco text-lg font-black mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                S/{s.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              added ? 'bg-nk-olive text-nk-ivory' : product.btnClass
            }`}
          >
            {added ? <IconCheck /> : <IconCart />}
            {added ? 'Agregado' : 'Al carrito'}
          </button>

          <Link
            to={`/producto/${product.slug}`}
            className="flex items-center justify-center gap-1.5 border-2 border-nk-choco/20 hover:border-nk-choco text-nk-muted hover:text-nk-choco px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          >
            Ver
            <IconArrow />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Products() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="productos" className="py-16 sm:py-24 lg:py-32 bg-nk-ivory">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        <div ref={titleRef} className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-nk-gold text-[10px] sm:text-xs tracking-[4px] mb-2 sm:mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              CATÁLOGO
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-black text-nk-choco leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nuestros
              <br />
              <span className="italic text-nk-gold">Productos</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-nk-muted text-sm max-w-xs leading-relaxed"
          >
            Cinco opciones únicas. Todos sin azúcar añadida, gluten free y con ingredientes reales.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
