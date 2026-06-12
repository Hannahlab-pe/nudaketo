import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Revela texto palabra por palabra con máscara (overflow-hidden + slide up).
 * - mode="load": anima al montar (ideal para el hero).
 * - mode="scroll": anima cuando entra en viewport (ideal para secciones).
 */
export default function RevealText({
  text,
  as: Tag = 'span',
  className = '',
  mode = 'scroll',
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('[data-word]')

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        words,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration,
          delay,
          stagger,
          ease: 'expo.out',
          paused: mode === 'scroll',
        }
      )

      if (mode === 'scroll') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => tween.play(),
        })
      }
    }, el)

    return () => ctx.revert()
  }, [text, mode, delay, stagger, duration])

  const words = String(text).split(' ')

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <span data-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
