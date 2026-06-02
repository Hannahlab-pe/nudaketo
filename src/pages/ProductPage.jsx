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
  const [activeImg, setActiveImg] = useState('detail')

  if (!product) {
    return (
      <div className="min-h-screen bg-nk-ivory flex items-center justify-center flex-col gap-4 px-5">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-xl font-bold text-center">Producto no encontrado</p>
        <Link to="/" className="text-nk-gold underline text-sm">Volver al inicio</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({ id: product.id, sizeId: selectedSize.id, name: product.name, sizeLabel: selectedSize.label, size: selectedSize.size, price: selectedSize.price, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const images = [
    { key: 'detail', src: product.imageDetail, label: 'Detalle' },
    { key: 'main', src: product.image, label: 'Lifestyle' },
  ]

  const related = products.filter((p) => p.id !== product.id).slice(0, 2)

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

          {/* Galería de imágenes */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            {/* Imagen principal */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-nk-arena shadow-[0_8px_40px_rgba(75,53,39,0.1)] aspect-square bg-nk-ivory2">
              <img
                src={images.find(i => i.key === activeImg)?.src}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-nk-choco text-nk-ivory text-[10px] font-black px-3 py-1.5 rounded-full"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {product.badge}
                </div>
              )}
            </div>

            {/* Miniaturas */}
            <div className="flex gap-3">
              {images.map((img) => (
                <button
                  key={img.key}
                  onClick={() => setActiveImg(img.key)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImg === img.key ? 'border-nk-gold shadow-[0_0_0_2px_rgba(194,164,94,0.3)]' : 'border-nk-arena hover:border-nk-gold/50'
                  }`}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info del producto */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 sm:gap-6"
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
                    className={`flex-1 rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-200 ${
                      selectedSize?.id === s.id ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena hover:border-nk-gold/50 bg-white'
                    }`}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace" }} className={`text-[9px] sm:text-[10px] tracking-[2px] ${selectedSize?.id === s.id ? 'text-nk-gold' : 'text-nk-muted'}`}>
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
            <div className="flex gap-3">
              <div className="flex items-center gap-2 border-2 border-nk-arena rounded-xl px-3 py-3 shrink-0">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-nk-muted hover:text-nk-choco w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M5 12h14"/></svg>
                </button>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold text-lg w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-nk-muted hover:text-nk-choco w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  added ? 'bg-nk-olive text-nk-ivory' : 'bg-nk-choco hover:bg-nk-gold text-nk-ivory'
                }`}
              >
                {added ? <><IconCheck />Agregado al carrito</> : <><IconCart />Agregar — S/{(selectedSize?.price * qty).toFixed(2)}</>}
              </button>
            </div>

            {/* WhatsApp directo */}
            <a
              href={`https://wa.me/51986769073?text=Hola!%20Quiero%20pedir%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(selectedSize?.label ?? '')}%20${encodeURIComponent(selectedSize?.size ?? '')})`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-nk-choco/20 hover:border-nk-gold text-nk-muted hover:text-nk-choco py-3 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0 text-green-600">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pedir directamente por WhatsApp
            </a>

            {/* Highlights */}
            <div className="border-t border-nk-arena pt-5">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] sm:text-xs tracking-[3px] mb-3 sm:mb-4">CARACTERÍSTICAS</p>
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
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Presentación', value: product.packaging },
                { label: 'Peso neto', value: product.netWeight },
                { label: 'Proteína', value: product.protein },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-nk-arena p-2.5 bg-white text-center">
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[8px] tracking-wider mb-1">{label.toUpperCase()}</p>
                  <p className="text-nk-choco text-[10px] sm:text-xs font-semibold leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
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
                  className="flex gap-4 items-center p-4 sm:p-5 rounded-2xl border border-nk-arena bg-white hover:border-nk-gold/40 hover:shadow-[0_4px_20px_rgba(75,53,39,0.08)] transition-all group overflow-hidden"
                >
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl overflow-hidden border border-nk-arena shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
        )}
      </div>
    </div>
  )
}
