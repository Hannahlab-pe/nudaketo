import { Link } from 'react-router-dom'

const legalLinks = [
  { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
  { label: 'Devoluciones', href: '/politica-de-devoluciones' },
  { label: 'Libro de Reclamaciones', href: '/libro-de-reclamaciones' },
]

export default function LegalLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />

      {/* Hero de página legal */}
      <div className="bg-nk-choco py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-xs tracking-[4px] mb-3">
            NUDA KETO
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-black text-nk-ivory leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-nk-ivory/50 text-sm mt-3">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[220px_1fr] gap-12">

        {/* Sidebar de navegación legal */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-4 uppercase">
              Legal
            </p>
            <nav className="flex flex-col gap-1">
              {legalLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className={`text-sm py-2 px-3 rounded-xl transition-all duration-200 ${
                    location.pathname === href
                      ? 'bg-nk-choco text-nk-ivory font-semibold'
                      : 'text-nk-muted hover:text-nk-choco hover:bg-nk-arena/30'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Contenido */}
        <main className="prose-custom max-w-none">
          {children}
        </main>
      </div>
    </div>
  )
}
