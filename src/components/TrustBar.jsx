import { motion } from 'motion/react'

const badges = [
  'Sin azúcar añadida',
  'Gluten Free',
  'Alta Proteína',
  '100% Keto',
  'Ingredientes naturales',
  'Eritritol & Monk Fruit',
  'Sin azúcar añadida',
  'Gluten Free',
  'Alta Proteína',
  '100% Keto',
  'Ingredientes naturales',
  'Eritritol & Monk Fruit',
]

export default function TrustBar() {
  return (
    <section className="py-4 bg-nk-choco border-y border-nk-gold/20 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-10 whitespace-nowrap w-max"
      >
        {badges.map((label, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="w-1 h-1 rounded-full bg-nk-gold" />
            <span
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-nk-ivory/75 tracking-[2px] text-xs uppercase"
            >
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
