import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Inicio', to: '/', type: 'route' },
  { label: 'Tienda', to: '/tienda', type: 'route' },
  { label: 'Sobre Nosotros', to: '/#nosotros', type: 'hash' },
]

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
    </svg>
  )
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  )
}

function NavItem({ link }) {
  const cls = 'text-nk-muted hover:text-nk-choco transition-colors duration-200 text-sm tracking-wide relative group'
  const underline = <span className="absolute -bottom-1 left-0 w-0 h-px bg-nk-gold transition-all duration-300 group-hover:w-full" />
  if (link.type === 'route') {
    return <Link to={link.to} className={cls}>{link.label}{underline}</Link>
  }
  return <a href={link.to} className={cls}>{link.label}{underline}</a>
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setIsOpen } = useCart()
  const { user, isAdmin, logout, openLogin } = useAuth()
  const isSeller = user?.role === 'VENDEDOR'

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
          {navLinks.map((link) => (
            <NavItem key={link.label} link={link} />
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

          {/* Panel admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-nk-gold/15 border border-nk-gold/40 text-nk-choco hover:bg-nk-gold/25 px-3 py-2 rounded-full text-xs font-semibold transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
              Panel
            </Link>
          )}

          {/* Panel vendedor */}
          {isSeller && (
            <Link
              to="/vendedor"
              className="flex items-center gap-1.5 bg-nk-gold/15 border border-nk-gold/40 text-nk-choco hover:bg-nk-gold/25 px-3 py-2 rounded-full text-xs font-semibold transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 5-6"/></svg>
              Mis ventas
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/perfil" className="text-nk-choco text-sm font-medium max-w-28 truncate hover:text-nk-gold transition-colors" title="Mi perfil">
                {user.name}
              </Link>
              <Link to="/mis-compras" className="text-nk-muted hover:text-nk-choco text-xs border border-nk-arena hover:border-nk-choco px-3 py-1.5 rounded-full transition-all">
                Mis compras
              </Link>
              <button
                onClick={logout}
                className="text-nk-muted hover:text-nk-choco text-xs border border-nk-arena hover:border-nk-choco px-3 py-1.5 rounded-full transition-all"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => openLogin()}
              className="flex items-center gap-2 bg-nk-choco hover:bg-nk-gold text-nk-ivory px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-[0_4px_20px_rgba(75,53,39,0.25)]"
            >
              <IconUser />
              Ingresar
            </button>
          )}
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
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {link.type === 'route' ? (
                    <Link to={link.to} onClick={() => setMenuOpen(false)} className="block text-nk-muted text-base py-1">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.to} onClick={() => setMenuOpen(false)} className="block text-nk-muted text-base py-1">
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 bg-nk-gold/15 border border-nk-gold/40 text-nk-choco px-4 py-2.5 rounded-full text-sm font-semibold">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
                  Panel de administración
                </Link>
              )}
              {isSeller && (
                <Link to="/vendedor" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 bg-nk-gold/15 border border-nk-gold/40 text-nk-choco px-4 py-2.5 rounded-full text-sm font-semibold">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 5-6"/></svg>
                  Mis ventas
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/perfil" onClick={() => setMenuOpen(false)} className="block text-nk-muted text-base py-1">
                    Mi perfil
                  </Link>
                  <Link to="/mis-compras" onClick={() => setMenuOpen(false)} className="block text-nk-muted text-base py-1">
                    Mis compras
                  </Link>
                  <div className="flex items-center justify-between pt-1 border-t border-nk-arena">
                    <span className="text-nk-choco text-sm font-medium truncate">{user.name}</span>
                    <button onClick={() => { logout(); setMenuOpen(false) }} className="text-nk-muted text-xs border border-nk-arena px-3 py-1.5 rounded-full">
                      Salir
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => { openLogin(); setMenuOpen(false) }}
                  className="flex items-center justify-center gap-2 bg-nk-choco text-nk-ivory px-5 py-3 rounded-full text-sm font-semibold"
                >
                  <IconUser />
                  Ingresar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
