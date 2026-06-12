import { useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Magnetic from './effects/Magnetic'

gsap.registerPlugin(ScrollTrigger)

export default function StoreShowcase() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const contentRef = useRef(null)
  const inView = useInView(contentRef, { once: true, margin: '-100px' })

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.25, yPercent: -8 },
        {
          scale: 1,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-nk-choco">
      {/* Imagen de fondo con parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src="/images/doble-cacao-lifestyle.jpg"
          alt="Colección NUDA KETO"
          className="w-full h-[120%] object-cover"
          loading="lazy"
        />
        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-linear-to-t from-nk-choco via-nk-choco/55 to-nk-choco/30" />
        <div className="absolute inset-0 bg-nk-choco/20" />
      </div>

      {/* Contenido */}
      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6 sm:gap-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-nk-gold text-[10px] sm:text-xs tracking-[5px]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          NUESTRA COLECCIÓN
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-nk-ivory leading-[1.05]"
        >
          Snacks keto que
          <br />
          <span className="italic text-nk-gold">amarás comer</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-nk-ivory/70 text-base sm:text-lg max-w-xl leading-relaxed"
        >
          Galletones, barras y bites elaborados con ingredientes reales.
          Sin azúcar añadida, gluten free y con proteína real.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Magnetic>
            <Link
              to="/tienda"
              className="flex items-center gap-3 bg-nk-gold hover:bg-nk-ivory text-nk-choco px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold transition-colors duration-300 shadow-[0_8px_40px_rgba(194,164,94,0.3)]"
            >
              Ir a la tienda
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Magnetic>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ fontFamily: "'DM Mono', monospace" }}
          className="text-nk-ivory/40 text-[10px] sm:text-xs tracking-[2px]"
        >
          5 PRODUCTOS · ENVÍOS A TODO EL PERÚ
        </motion.p>
      </div>
    </section>
  )
}
