import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const values = [
  { abbr: 'IR', title: 'Ingredientes reales', desc: 'Sin aditivos artificiales ni conservantes' },
  { abbr: 'FP', title: 'Formulación precisa', desc: 'Macros balanceados para estilo keto' },
  { abbr: 'SA', title: 'Sin azúcar añadida', desc: 'Eritritol y monk fruit de calidad' },
  { abbr: 'CA', title: 'Calidad artesanal', desc: 'Elaborado con dedicación y cuidado' },
]

export default function BrandStory() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="nosotros" className="py-24 lg:py-36 bg-nk-ivory2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Lado izquierdo: visual */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-white border border-nk-arena shadow-[0_8px_40px_rgba(75,53,39,0.1)] p-8 lg:p-12">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-nk-gold/6 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-start gap-8">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-nk-gold flex flex-col items-center justify-center bg-nk-ivory">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <ellipse cx="12" cy="12" rx="4" ry="6" stroke="#C2A45E" strokeWidth="1.5"/>
                      <path d="M12 6 C12 6 8 10 8 14" stroke="#C2A45E" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco">NUDA KETO</p>
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-xs tracking-[3px]">SNACKS PREMIUM</p>
                  </div>
                </div>

                <blockquote style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl lg:text-4xl font-bold italic text-nk-choco leading-snug">
                  "Comer sano no implica<span className="text-nk-gold"> comer feo.</span>"
                </blockquote>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-nk-arena">
                  {[
                    { value: '0g', label: 'Azúcar añadida' },
                    { value: '6g', label: 'Proteína' },
                    { value: '100%', label: 'Gluten free' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-gold">
                        {value}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dot pattern */}
            <div className="absolute -bottom-6 -left-6 grid grid-cols-5 gap-2 opacity-20 pointer-events-none">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-nk-gold" />
              ))}
            </div>
          </motion.div>

          {/* Lado derecho: texto */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-nk-gold text-xs tracking-[4px] mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                PRESENTACIÓN
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-black text-nk-choco leading-tight">
                Snacks que respetan
                <span className="italic text-nk-gold"> tu cuerpo</span>
              </h2>
            </div>

            <p className="text-nk-muted text-base lg:text-lg leading-relaxed">
              <span className="font-semibold text-nk-choco">NUDA KETO</span> desarrolla snacks saludables sin azúcar añadida
              y libres de gluten, elaborados con ingredientes cuidadosamente seleccionados.
            </p>

            <p className="text-nk-muted text-base leading-relaxed">
              Cada galletón y barra nace de la convicción de que el bienestar no debe
              sacrificar el placer. Usamos eritritol y extracto de monk fruit para endulzar
              de forma natural, manteniendo el perfil keto sin comprometer el sabor.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {values.map(({ abbr, title, desc }) => (
                <div key={title} className="rounded-2xl border border-nk-arena p-5 bg-white hover:border-nk-gold/40 transition-colors shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-nk-arena/40 flex items-center justify-center mb-3">
                    <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] font-bold">{abbr}</span>
                  </div>
                  <p className="text-nk-choco text-sm font-semibold mb-1">{title}</p>
                  <p className="text-nk-muted text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
