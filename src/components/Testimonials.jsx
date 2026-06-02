import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const testimonials = [
  {
    name: 'María G.',
    role: 'Nutricionista · Lima',
    stars: 5,
    text: 'Finalmente un snack keto que no sabe a cartón. Los galletones son increíblemente buenos y mis pacientes los adoran. Los recomiendo siempre.',
    initial: 'M',
  },
  {
    name: 'Carlos R.',
    role: 'Atleta · CrossFit',
    stars: 5,
    text: 'Llevo 3 meses en dieta keto y estos snacks me salvaron. La barra de cacao y avellana es perfecta entre entrenos. Sin azúcar real.',
    initial: 'C',
  },
  {
    name: 'Sofía L.',
    role: 'Emprendedora · Miraflores',
    stars: 5,
    text: 'Los pido cada semana. El galletón de vainilla chips es adictivo. No puedo creer que sea keto. El packaging es hermoso además.',
    initial: 'S',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 lg:py-32 bg-nk-ivory2">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div ref={ref} className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-nk-gold text-xs tracking-[4px] mb-3"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            TESTIMONIOS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl lg:text-5xl font-black text-nk-choco"
          >
            Lo que dicen
            <span className="italic text-nk-gold"> nuestros clientes</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, stars, text, initial }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
              className="rounded-3xl border border-nk-arena p-7 bg-white hover:border-nk-gold/40 hover:shadow-[0_4px_20px_rgba(75,53,39,0.08)] transition-colors flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: stars }).map((_, j) => (
                  <svg key={j} viewBox="0 0 24 24" className="w-4 h-4 fill-nk-gold">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              <p className="text-nk-muted text-base leading-relaxed italic flex-1">"{text}"</p>

              <div className="flex items-center gap-3 pt-2 border-t border-nk-arena">
                <div className="w-10 h-10 rounded-full bg-nk-choco flex items-center justify-center shrink-0">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-ivory font-bold text-sm">{initial}</span>
                </div>
                <div>
                  <p className="text-nk-choco text-sm font-semibold">{name}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-wide">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
