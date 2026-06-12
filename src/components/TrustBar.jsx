import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const rowA = ['Sin azúcar añadida', 'Gluten Free', 'Alta Proteína', '100% Keto', 'Ingredientes naturales', 'Eritritol & Monk Fruit']
const rowB = ['Hecho en Perú', 'Bolsa resellable', 'Cero culpa', 'Snack premium', 'Doble cacao', 'Almendra real']

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-nk-gold shrink-0">
      <path d="M12 0l2.4 7.6L22 8.4l-6 5.2 2 8L12 17.6 6 21.6l2-8-6-5.2 7.6-.8z" />
    </svg>
  )
}

function MarqueeRow({ items, direction = 1, baseDuration = 24 }) {
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    let idle
    const ctx = gsap.context(() => {
      const loop = gsap.to(trackRef.current, {
        xPercent: direction === 1 ? -50 : 0,
        ...(direction === -1 ? { startAt: { xPercent: -50 }, xPercent: 0 } : {}),
        repeat: -1,
        duration: baseDuration,
        ease: 'none',
      })

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = Math.abs(self.getVelocity())
          const speed = gsap.utils.clamp(1, 6, 1 + v / 400)
          gsap.to(loop, { timeScale: speed, duration: 0.3, overwrite: true })
          clearTimeout(idle)
          idle = setTimeout(() => gsap.to(loop, { timeScale: 1, duration: 1, ease: 'power2.out', overwrite: true }), 120)
        },
      })

      return () => { st.kill(); loop.kill() }
    }, trackRef)

    return () => { clearTimeout(idle); ctx.revert() }
  }, [direction, baseDuration])

  // Duplicado para loop continuo
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex items-center gap-8 w-max will-change-transform">
        {doubled.map((label, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black italic text-nk-ivory whitespace-nowrap"
            >
              {label}
            </span>
            <Star />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TrustBar() {
  return (
    <section className="py-8 sm:py-10 bg-nk-choco border-y border-nk-gold/20 overflow-hidden flex flex-col gap-3 sm:gap-4">
      <MarqueeRow items={rowA} direction={1} baseDuration={26} />
      <MarqueeRow items={rowB} direction={-1} baseDuration={30} />
    </section>
  )
}
