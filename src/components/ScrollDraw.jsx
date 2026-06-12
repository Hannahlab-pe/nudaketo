import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Línea orgánica que se "dibuja" a medida que haces scroll (stroke-dashoffset
 * sincronizado con la posición del scroll). Termina en el motivo de semilla NUDA.
 */
export default function ScrollDraw() {
  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const seedRef = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(seedRef.current, { scale: 0, transformOrigin: 'center', opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
      })

      tl.to(path, { strokeDashoffset: 0, ease: 'none' })
        .to(seedRef.current, { scale: 1, opacity: 1, ease: 'back.out(2)' }, '-=0.2')

      gsap.from(textRef.current, {
        opacity: 0,
        yPercent: 60,
        ease: 'none',
        scrollTrigger: { trigger: wrapRef.current, start: 'top 80%', end: 'center 60%', scrub: 1 },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapRef} className="min-h-screen flex items-center bg-nk-ivory py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-10 flex flex-col items-center text-center gap-8 w-full">
        <p ref={textRef} style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-4xl lg:text-5xl font-black text-nk-choco leading-tight">
          Del cacao puro a tu mano.<br />
          <span className="italic text-nk-gold">Sin atajos, sin azúcar.</span>
        </p>

        <svg viewBox="0 0 800 160" className="w-full max-w-3xl" fill="none">
          <path
            ref={pathRef}
            d="M20 80 C 140 10, 220 150, 360 80 S 560 10, 700 80 C 740 100, 760 80, 770 80"
            stroke="#C2A45E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Semilla al final del trazo */}
          <g ref={seedRef} transform="translate(770, 80)">
            <ellipse cx="0" cy="0" rx="9" ry="14" stroke="#4B3527" strokeWidth="2" fill="#F3EDDD" />
            <path d="M0 -8 C 0 -8, -8 -2, -8 6" stroke="#7A7F63" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>

        <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] sm:text-xs tracking-[3px]">
          NUDA KETO · INGREDIENTES REALES
        </p>
      </div>
    </section>
  )
}
