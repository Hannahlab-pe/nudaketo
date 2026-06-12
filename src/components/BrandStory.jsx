import { useRef, useLayoutEffect } from 'react'
import { motion, useInView } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const values = [
  { abbr: 'IR', title: 'Ingredientes reales', desc: 'Sin aditivos artificiales ni conservantes' },
  { abbr: 'FP', title: 'Formulación precisa', desc: 'Macros balanceados para estilo keto' },
  { abbr: 'SA', title: 'Sin azúcar añadida', desc: 'Eritritol y monk fruit de calidad' },
  { abbr: 'CA', title: 'Calidad artesanal', desc: 'Elaborado con dedicación y cuidado' },
]

export default function BrandStory() {
  const ref = useRef(null)
  const sectionRef = useRef(null)
  const visualRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(visualRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="nosotros" ref={sectionRef} className="min-h-screen flex items-center py-20 lg:py-24 bg-nk-ivory2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 w-full">
        <div ref={ref} className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Visual */}
          <motion.div
            ref={visualRef}
            initial={{ x: -40, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-nk-arena shadow-[0_8px_40px_rgba(75,53,39,0.1)] p-6 sm:p-8 lg:p-12">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-nk-gold/6 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-start gap-6 sm:gap-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-nk-gold flex flex-col items-center justify-center bg-nk-ivory shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 sm:w-6 h-5 sm:h-6" fill="none">
                      <ellipse cx="12" cy="12" rx="4" ry="6" stroke="#C2A45E" strokeWidth="1.5"/>
                      <path d="M12 6 C12 6 8 10 8 14" stroke="#C2A45E" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl sm:text-2xl font-bold text-nk-choco">NUDA KETO</p>
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] sm:text-xs tracking-[3px]">SNACKS PREMIUM</p>
                  </div>
                </div>

                <blockquote style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl lg:text-4xl font-bold italic text-nk-choco leading-snug">
                  "Comer sano no implica<span className="text-nk-gold"> comer feo.</span>"
                </blockquote>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full pt-4 border-t border-nk-arena">
                  {[
                    { value: '0g', label: 'Azúcar añadida' },
                    { value: '6g', label: 'Proteína' },
                    { value: '100%', label: 'Gluten free' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl font-black text-nk-gold">
                        {value}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[9px] sm:text-[10px] tracking-wider">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dot pattern — oculto en mobile */}
            <div className="hidden sm:grid absolute -bottom-6 -left-6 grid-cols-5 gap-2 opacity-20 pointer-events-none">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-nk-gold" />
              ))}
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <div>
              <p className="text-nk-gold text-[10px] sm:text-xs tracking-[4px] mb-3 sm:mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                PRESENTACIÓN
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-black text-nk-choco leading-tight">
                Snacks que respetan
                <span className="italic text-nk-gold"> tu cuerpo</span>
              </h2>
            </div>

            <p className="text-nk-muted text-sm sm:text-base lg:text-lg leading-relaxed">
              <span className="font-semibold text-nk-choco">NUDA KETO</span> desarrolla snacks saludables sin azúcar añadida
              y libres de gluten, elaborados con ingredientes cuidadosamente seleccionados.
            </p>

            <p className="text-nk-muted text-sm sm:text-base leading-relaxed">
              Cada galletón y barra nace de la convicción de que el bienestar no debe
              sacrificar el placer. Usamos eritritol y extracto de monk fruit para endulzar
              de forma natural, manteniendo el perfil keto sin comprometer el sabor.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {values.map(({ abbr, title, desc }) => (
                <div key={title} className="rounded-xl sm:rounded-2xl border border-nk-arena p-4 sm:p-5 bg-white hover:border-nk-gold/40 transition-colors shadow-sm">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-nk-arena/40 flex items-center justify-center mb-2 sm:mb-3">
                    <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] sm:text-[10px] font-bold">{abbr}</span>
                  </div>
                  <p className="text-nk-choco text-xs sm:text-sm font-semibold mb-1">{title}</p>
                  <p className="text-nk-muted text-[11px] sm:text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
