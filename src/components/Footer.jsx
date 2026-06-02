import { Link } from 'react-router-dom'

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
)
const IconTikTok = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.84 4.84 0 01-1.01-.04z"/>
  </svg>
)
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)

const navLinks = [
  { label: 'Productos', href: '/#productos' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Ingredientes', href: '/#ingredientes' },
]

const legalLinks = [
  { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
  { label: 'Devoluciones', href: '/politica-de-devoluciones' },
  { label: 'Libro de Reclamaciones', href: '/libro-de-reclamaciones' },
]

const productLinks = [
  { label: 'Galletón Chips & Almendras', href: '/producto/galleton-chips-almendras' },
  { label: 'Galletón Doble Cacao', href: '/producto/galleton-doble-cacao' },
  { label: 'Galletón Vainilla Chips', href: '/producto/galleton-vainilla-chips' },
  { label: 'Barra Cacao Nuts', href: '/producto/barra-cacao-nuts' },
  { label: 'Keto Bites Almendras & Sal', href: '/producto/keto-bites-almendras-sal' },
]

export default function Footer() {
  return (
    <footer className="bg-nk-choco overflow-hidden">

      {/* Columnas superiores */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-nk-gold flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <ellipse cx="12" cy="12" rx="4" ry="6" stroke="#C2A45E" strokeWidth="1.5"/>
                  <path d="M12 6 C12 6 8 10 8 14" stroke="#C2A45E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-nk-ivory text-xl leading-none">NUDA</p>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-[5px]">KETO</p>
              </div>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-nk-ivory/50 text-sm leading-relaxed max-w-48">
              "Comer sano no implica comer feo."
            </p>
            <div className="flex gap-3">
              {[
                { icon: <IconInstagram />, label: 'Instagram', href: '#' },
                { icon: <IconTikTok />, label: 'TikTok', href: '#' },
                { icon: <IconFacebook />, label: 'Facebook', href: '#' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-nk-ivory/15 flex items-center justify-center text-nk-ivory/50 hover:text-nk-gold hover:border-nk-gold transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[3px]">PRODUCTOS</p>
            <nav className="flex flex-col gap-2 sm:gap-2.5">
              {productLinks.map(({ label, href }) => (
                <Link key={label} to={href} className="text-nk-ivory/55 hover:text-nk-ivory text-xs sm:text-sm transition-colors leading-snug">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[3px]">NAVEGACIÓN</p>
            <nav className="flex flex-col gap-2 sm:gap-2.5">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href} className="text-nk-ivory/55 hover:text-nk-ivory text-xs sm:text-sm transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal + Contacto */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 sm:gap-4">
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[3px]">LEGAL</p>
            <nav className="flex flex-col gap-2 sm:gap-2.5">
              {legalLinks.map(({ label, href }) => (
                <Link key={label} to={href} className="text-nk-ivory/55 hover:text-nk-ivory text-xs sm:text-sm transition-colors leading-snug">
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-nk-ivory/8">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[3px] mb-2">CONTACTO</p>
              <a
                href="https://wa.me/51999999999"
                className="text-nk-ivory/55 hover:text-nk-gold text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <p className="text-nk-ivory/40 text-xs mt-1.5">Lima, Perú</p>
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="h-px bg-nk-ivory/8" />
      </div>

      {/* Mega brand name */}
      <div className="overflow-hidden select-none">
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(52px, 15vw, 200px)',
            lineHeight: '0.85',
            letterSpacing: '-0.03em',
          }}
          className="font-black text-nk-ivory/6 px-3 sm:px-6 lg:px-8 pt-4 pb-0 whitespace-nowrap"
        >
          NUDA KETO
        </p>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-ivory/25 text-[10px] sm:text-[11px] tracking-wider text-center sm:text-left">
          © 2026 NUDA KETO. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {['Sin azúcar', 'Gluten free', 'Keto'].map((label) => (
            <span
              key={label}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="border border-nk-gold/25 text-nk-gold/60 text-[9px] tracking-[1px] px-2 sm:px-2.5 py-1 rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
