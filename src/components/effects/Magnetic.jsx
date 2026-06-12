import { useRef } from 'react'
import gsap from 'gsap'

/**
 * Envuelve un elemento para que siga sutilmente al cursor (efecto magnético premium).
 * Se desactiva en dispositivos táctiles automáticamente (no hay mousemove).
 */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' })
  }

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`inline-flex ${className}`}>
      {children}
    </div>
  )
}
