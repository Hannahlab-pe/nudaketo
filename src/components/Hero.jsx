import { useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Magnetic from './effects/Magnetic'

gsap.registerPlugin(ScrollTrigger)

const fadeUp = (delay = 0) => ({
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

const trustItems = ['Sin azúcar añadida', 'Gluten free', 'Alta proteína']

const headlineLines = [
  { text: 'Comer', className: 'text-nk-choco' },
  { text: 'sano', className: 'italic text-nk-gold' },
  { text: 'es elegir', className: 'text-nk-choco' },
  { text: 'mejor.', className: 'italic text-nk-olive' },
]

export default function Hero() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const imageRef = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Revelado del título palabra por palabra con máscara
      const words = headlineRef.current.querySelectorAll('[data-word]')
      gsap.fromTo(
        words,
        { yPercent: 120 },
        { yPercent: 0, duration: 1, stagger: 0.09, ease: 'expo.out', delay: 0.25 }
      )

      // Parallax al hacer scroll
      gsap.to(imageRef.current, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(blob1Ref.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(blob2Ref.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-nk-ivory">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div ref={blob1Ref} className="absolute top-1/3 left-1/4 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-nk-gold/10 blur-[80px] sm:blur-[120px]" />
        <div ref={blob2Ref} className="absolute bottom-1/4 right-1/4 w-48 sm:w-[350px] h-48 sm:h-[350px] rounded-full bg-nk-olive/8 blur-[60px] sm:blur-[100px]" />
      </div>

      {/* Asterisco decorativo desktop */}
      <motion.div
        initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute top-28 right-24 text-nk-gold/15 text-[120px] select-none pointer-events-none"
        style={{ fontFamily: 'serif' }}
      >
        ✦
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-28 pb-16 lg:py-32 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">

        {/* Texto */}
        <div className="flex flex-col gap-5 lg:gap-8">
          <motion.div {...fadeUp(0.1)}>
            <span
              className="inline-flex items-center gap-2 border border-nk-gold/50 text-nk-gold text-[10px] sm:text-xs tracking-[2px] sm:tracking-[3px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-nk-gold/5"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-nk-gold animate-pulse shrink-0" />
              SNACKS KETO PREMIUM
            </span>
          </motion.div>

          {/* Título con revelado GSAP por máscara */}
          <h1 ref={headlineRef} className="leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            {headlineLines.map((line) => (
              <span key={line.text} className="block overflow-hidden" style={{ paddingBottom: '0.05em' }}>
                <span data-word className={`block text-[clamp(40px,9vw,96px)] font-black will-change-transform ${line.className}`}>
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <motion.p {...fadeUp(0.7)} className="text-nk-muted text-base lg:text-lg max-w-md leading-relaxed">
            Snacks elaborados con ingredientes reales, sin azúcar añadida y libres de gluten.
            El placer de comer rico <span className="text-nk-choco font-medium">sin culpa</span>.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Magnetic>
              <Link
                to="/tienda"
                className="flex items-center justify-center gap-2.5 bg-nk-choco hover:bg-nk-gold text-nk-ivory px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-colors duration-300 hover:shadow-[0_8px_30px_rgba(75,53,39,0.3)]"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Comprar ahora
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#nosotros"
                className="flex items-center justify-center gap-2 border-2 border-nk-choco/25 text-nk-choco hover:border-nk-gold hover:text-nk-gold px-6 py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors duration-300"
              >
                Conócenos
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </Magnetic>
          </motion.div>

          <motion.div {...fadeUp(0.9)} className="flex flex-wrap gap-4 pt-1">
            {trustItems.map((label) => (
              <span key={label} className="flex items-center gap-2 text-nk-muted text-xs sm:text-sm">
                <span className="w-1 h-1 rounded-full bg-nk-gold shrink-0" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Imagen real del producto hero */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:flex relative justify-center items-center"
        >
          {/* Glow detrás */}
          <div className="absolute inset-8 rounded-3xl bg-nk-gold/12 blur-3xl" />

          <div ref={imageRef} className="relative w-full">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full"
            >
              <img
                src="/images/chips-almendras-lifestyle.jpg"
                alt="Galletón Chips Almendras NUDA KETO"
                className="w-full h-auto rounded-3xl shadow-[0_32px_80px_rgba(75,53,39,0.22)] object-cover"
                loading="eager"
              />

              {/* Badge flotante */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: -6 }}
                transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-3 -right-3 bg-nk-choco text-nk-ivory text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                MÁS VENDIDO
              </motion.div>

              {/* Badge inferior */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-nk-arena shadow-lg rounded-2xl px-4 py-2.5 flex items-center gap-3 whitespace-nowrap"
              >
                <div className="flex flex-col">
                  <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-wider">PACK x3</span>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-black text-lg leading-none">S/25.00</span>
                </div>
                <div className="w-px h-8 bg-nk-arena" />
                <div className="flex flex-col">
                  <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-wider">INDIVIDUAL</span>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-black text-lg leading-none">S/8.50</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-nk-gold/60"
      >
        <span className="text-[9px] tracking-[3px]" style={{ fontFamily: "'DM Mono', monospace" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-6 bg-linear-to-b from-nk-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
