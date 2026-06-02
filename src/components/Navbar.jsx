import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../context/CartContext'

const links = [
  { label: 'Productos', href: '/#productos' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Ingredientes', href: '/#ingredientes' },
]

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setIsOpen } = useCart()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-2xl bg-nk-ivory/92 border-b border-nk-gold/25 shadow-[0_2px_20px_rgba(75,53,39,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border-2 border-nk-gold flex items-center justify-center transition-all duration-300 group-hover:bg-nk-gold/10">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <ellipse cx="12" cy="12" rx="4" ry="6" stroke="#C2A45E" strokeWidth="1.5"/>
              <path d="M12 6 C12 6 8 10 8 14" stroke="#C2A45E" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="leading-none">
            <div style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-nk-choco text-xl leading-none tracking-wider">NUDA</div>
            <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-[5px] mt-0.5">KETO</div>
          </div>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-nk-muted hover:text-nk-choco transition-colors duration-200 text-sm tracking-wide relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-nk-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Carrito */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-10 h-10 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-all duration-200"
            aria-label="Carrito"
          >
            <IconCart />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-nk-gold text-nk-ivory text-[9px] font-bold flex items-center justify-center"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </button>

          {/* CTA WhatsApp */}
          <a
            href="https://wa.me/51999999999?text=Hola!%20Me%20interesa%20un%20pedido%20de%20NUDA%20KETO"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-nk-choco hover:bg-nk-gold text-nk-ivory px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_20px_rgba(75,53,39,0.25)]"
          >
            <IconWhatsApp />
            Pedir ahora
          </a>
        </div>

        {/* Mobile: carrito + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-9 h-9 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted"
            aria-label="Carrito"
          >
            <IconCart />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-nk-gold text-nk-ivory text-[9px] font-bold flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 flex flex-col justify-center items-center gap-1.5" aria-label="Menú">
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-nk-choco origin-center" />
            <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block w-6 h-0.5 bg-nk-choco" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-nk-choco origin-center" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-nk-ivory/95 backdrop-blur-xl border-t border-nk-gold/20"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {links.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setMenuOpen(false)}
                  className="text-nk-muted text-base py-1"
                >
                  {label}
                </motion.a>
              ))}
              <a
                href="https://wa.me/51999999999"
                className="mt-2 flex items-center justify-center gap-2 bg-nk-choco text-nk-ivory px-5 py-3 rounded-full text-sm font-semibold"
              >
                <IconWhatsApp />
                Pedir ahora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
