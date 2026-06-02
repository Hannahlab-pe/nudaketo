export default function Footer() {
  return (
    <footer className="bg-nk-choco border-t border-nk-gold/15 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-nk-gold flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <ellipse cx="12" cy="12" rx="4" ry="6" stroke="#C2A45E" strokeWidth="1.5"/>
                  <path d="M12 6 C12 6 8 10 8 14" stroke="#C2A45E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-nk-ivory text-lg leading-none">NUDA</p>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-[5px]">KETO</p>
              </div>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-nk-ivory/60 text-sm text-center lg:text-left max-w-55">
              "Comer sano no implica comer feo."
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-3">
            {[
              { label: 'Productos', href: '#productos' },
              { label: 'Nosotros', href: '#nosotros' },
              { label: 'Ingredientes', href: '#ingredientes' },
              { label: 'Contacto', href: '#' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-nk-ivory/60 hover:text-nk-ivory text-sm transition-colors">
                {label}
              </a>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Sin azúcar', 'Gluten free', 'Keto'].map((b) => (
              <span key={b} style={{ fontFamily: "'DM Mono', monospace" }} className="border border-nk-gold/30 text-nk-gold text-[10px] tracking-[2px] px-3 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-nk-ivory/8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-ivory/30 text-[11px] tracking-wider">
            © 2026 NUDA KETO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-ivory/20 text-[11px]">
            LIMA, PERÚ
          </p>
        </div>
      </div>
    </footer>
  )
}
