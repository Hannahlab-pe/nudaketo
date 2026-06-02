import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const end = parseInt(target)
    let start = 0
    const timer = setInterval(() => {
      start += Math.ceil(end / (1500 / 16))
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

const features = [
  {
    label: 'HA',
    title: 'Harina de Almendra',
    desc: 'Base keto por excelencia. Alta en grasas buenas, baja en carbohidratos, con textura perfecta.',
  },
  {
    label: 'CH',
    title: 'Chips Sin Azúcar',
    desc: 'Chocolate premium sin azúcar añadida. Sabor intenso sin alterar tu metabolismo.',
  },
  {
    label: 'EM',
    title: 'Eritritol & Monk Fruit',
    desc: 'Endulzantes naturales con índice glucémico cero. Dulzor real, sin impacto en insulina.',
  },
  {
    label: 'VR',
    title: 'Vainilla Real',
    desc: 'Extracto puro de vainilla, no artificial. Aroma y sabor profundo que hace la diferencia.',
  },
  {
    label: 'AT',
    title: 'Almendras Tostadas',
    desc: 'Almendras laminadas tostadas artesanalmente. Crunch natural y proteína de calidad.',
  },
  {
    label: '0C',
    title: 'Cero Conservantes',
    desc: 'Sin aditivos artificiales. Lo que lees en la etiqueta es exactamente lo que comes.',
  },
]

const stats = [
  { value: '0', suffix: 'g', label: 'Azúcar añadida' },
  { value: '6', suffix: 'g', label: 'Proteína por unidad' },
  { value: '3', suffix: '', label: 'Variedades únicas' },
  { value: '100', suffix: '%', label: 'Gluten free' },
]

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="ingredientes" className="py-24 lg:py-32 bg-nk-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Stats bar */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 mb-20 rounded-3xl overflow-hidden bg-nk-choco"
        >
          {stats.map(({ value, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center lg:items-start gap-1 p-8 border-r border-nk-ivory/10 last:border-0 border-b lg:border-b-0"
            >
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-black text-nk-gold">
                <Counter target={value} suffix={suffix} />
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-ivory/50 text-xs tracking-wider text-center lg:text-left">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-nk-gold text-xs tracking-[4px] mb-3"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            INGREDIENTES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl lg:text-5xl font-black text-nk-choco leading-none"
          >
            Solo lo que
            <span className="italic text-nk-gold"> necesitas</span>
          </motion.h2>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ label, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="group rounded-2xl border border-nk-arena p-7 bg-white hover:border-nk-gold/40 hover:shadow-[0_4px_20px_rgba(75,53,39,0.08)] transition-all duration-300 cursor-default"
            >
              {/* Iniciales en lugar de emoji */}
              <div className="w-10 h-10 rounded-xl bg-nk-arena/40 border border-nk-arena flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-nk-gold/10 group-hover:border-nk-gold/40">
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-xs font-bold tracking-wider">
                  {label}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold text-nk-choco mb-2">{title}</h3>
              <p className="text-nk-muted text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
