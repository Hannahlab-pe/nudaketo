import { useRef } from 'react'
import gsap from 'gsap'

/**
 * Aplica un tilt 3D sutil siguiendo el cursor. El revelado de entrada (opacity/y)
 * debe manejarse en un wrapper externo para no pelear con estos transforms.
 */
export default function TiltCard({ children, className = '', max = 7, glare = true }) {
  const inner = useRef(null)
  const glareRef = useRef(null)

  const handleMove = (e) => {
    const el = inner.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, {
      rotateY: px * max,
      rotateX: -py * max,
      transformPerspective: 900,
      transformOrigin: 'center',
      duration: 0.5,
      ease: 'power2.out',
    })
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0.12,
        background: `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, #fff, transparent 60%)`,
        duration: 0.3,
      })
    }
  }

  const handleLeave = () => {
    gsap.to(inner.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' })
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.4 })
  }

  return (
    <div className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ perspective: 900 }}>
      <div ref={inner} className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
        {glare && (
          <div ref={glareRef} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0" style={{ mixBlendMode: 'soft-light' }} />
        )}
      </div>
    </div>
  )
}
