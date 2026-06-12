import { useRef, useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

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

function ShowcaseCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const defaultSize = product.sizes[0]

  const handleAdd = () => {
    addItem({
      id: product.id, sizeId: defaultSize.id, name: product.name,
      sizeLabel: defaultSize.label, size: defaultSize.size, price: defaultSize.price, qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <article className={`shrink-0 w-[82vw] sm:w-[420px] rounded-3xl overflow-hidden border border-nk-arena ${product.cardBg} flex flex-col snap-center group`}>
      <Link to={`/producto/${product.slug}`} className="block overflow-hidden aspect-[4/3] relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-nk-choco text-nk-ivory text-[10px] font-black px-3 py-1.5 rounded-full" style={{ fontFamily: "'DM Mono', monospace" }}>
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-6 sm:p-7 flex flex-col gap-4 flex-1">
        <div>
          <p className={`text-[10px] tracking-[3px] mb-1.5 ${product.accentClass}`} style={{ fontFamily: "'DM Mono', monospace" }}>
            {product.tagline}
          </p>
          <h3 className="text-2xl font-bold text-nk-choco leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h3>
        </div>

        <p className="text-nk-muted text-sm leading-relaxed">{product.shortDesc}</p>

        <div className="flex-1" />
        <div className="w-full h-px bg-nk-arena/60" />

        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] text-nk-muted">Desde</span>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco leading-none">
              S/{Math.min(...product.sizes.map(s => s.price)).toFixed(2)}
            </p>
          </div>
          <Link to={`/producto/${product.slug}`} className="flex items-center gap-1 text-nk-muted hover:text-nk-choco text-sm transition-colors">
            Ver detalle <IconArrow />
          </Link>
        </div>

        <button
          onClick={handleAdd}
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            added ? 'bg-nk-olive text-nk-ivory' : product.btnClass
          }`}
        >
          {added ? <IconCheck /> : <IconCart />}
          {added ? 'Agregado al carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}

export default function Products() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const track = trackRef.current
      const getScrollDist = () => track.scrollWidth - window.innerWidth + 96 // padding compensación

      const tween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress })
          },
        },
      })

      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="productos" ref={sectionRef} className="relative bg-nk-ivory overflow-hidden">
      <div className="md:h-screen flex flex-col justify-center py-16 md:py-0">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 w-full mb-8 md:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="text-nk-gold text-[10px] sm:text-xs tracking-[4px] mb-2 sm:mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                CATÁLOGO
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-nk-choco leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nuestros <span className="italic text-nk-gold">Productos</span>
              </h2>
            </div>
            <p className="text-nk-muted text-sm max-w-xs leading-relaxed hidden md:flex items-center gap-2">
              <span className="hidden lg:inline">Desplázate para explorar</span>
              <IconArrow />
            </p>
          </div>

          {/* Barra de progreso del carrusel (desktop) */}
          <div className="hidden md:block mt-6 h-px bg-nk-arena/60 relative overflow-hidden rounded-full">
            <div ref={progressRef} className="absolute inset-0 bg-nk-gold origin-left" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>

        {/* Track horizontal: pin+scrub en desktop, swipe en mobile */}
        <div className="overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory">
          <div
            ref={trackRef}
            className="flex gap-5 sm:gap-6 px-5 sm:px-6 lg:pl-10 lg:pr-[20vw] w-max will-change-transform"
          >
            {products.map((product) => (
              <ShowcaseCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
