import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="min-h-screen flex items-center py-20 lg:py-24 bg-nk-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-nk-choco px-6 sm:px-10 lg:px-16 py-12 sm:py-14 lg:py-16 text-center"
        >
          {/* Glows */}
          <div className="absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-nk-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-nk-olive/10 blur-3xl pointer-events-none" />
          <div className="absolute top-8 right-8 sm:right-12 text-nk-gold/12 text-4xl sm:text-6xl select-none pointer-events-none" style={{ fontFamily: 'serif' }}>✦</div>
          <div className="absolute bottom-8 left-8 sm:left-12 text-nk-gold/8 text-3xl sm:text-4xl select-none pointer-events-none" style={{ fontFamily: 'serif' }}>✦</div>

          <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-7 max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-nk-gold text-[10px] sm:text-xs tracking-[4px]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              HAZ TU PEDIDO
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl sm:text-4xl lg:text-6xl font-black text-nk-ivory leading-tight"
            >
              ¿Listo para
              <span className="italic text-nk-gold"> elegir mejor</span>?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-nk-ivory/65 text-sm sm:text-base lg:text-lg leading-relaxed"
            >
              Compra online con pago seguro. Entrega en Lima y a todo el Perú.
              Bolsa doypack resellable para mantener la frescura.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/tienda"
                className="flex items-center gap-2.5 bg-nk-gold hover:bg-nk-gold2 text-nk-choco px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(194,164,94,0.4)]"
              >
                <svg viewBox="0 0 24 24" className="w-5 sm:w-6 h-5 sm:h-6 fill-none stroke-current stroke-2 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Ir a la tienda
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-nk-ivory/35 text-[10px] sm:text-xs tracking-wider"
            >
              ENVÍOS A LIMA Y TODO EL PERÚ
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
