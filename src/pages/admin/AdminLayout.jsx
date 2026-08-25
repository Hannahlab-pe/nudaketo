import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const IconDash = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" />
  </svg>
)
const IconOrders = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zM9 9h6M9 13h6M9 17h3" />
  </svg>
)
const IconBox = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5m18 0v8l-9 5-9-5V8m18 0l-9 5-9-5" />
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M13 11a4 4 0 10-4-4 4 4 0 004 4z" />
  </svg>
)
const IconChart = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 5-6" />
  </svg>
)

const NAV = [
  { to: '/admin', label: 'Resumen', icon: <IconDash />, end: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: <IconOrders /> },
  { to: '/admin/productos', label: 'Productos', icon: <IconBox /> },
  { to: '/admin/clientes', label: 'Clientes', icon: <IconUsers /> },
  { to: '/admin/vendedores', label: 'Vendedores', icon: <IconChart /> },
]

function Gate({ children }) {
  const { isAuthenticated, isAdmin, openLogin } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nk-ivory px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco">
          Panel de administración
        </p>
        <p className="text-sm text-nk-muted">Inicia sesión con tu cuenta de administrador.</p>
        <button
          onClick={() => openLogin()}
          className="rounded-full bg-nk-choco px-6 py-3 text-sm font-semibold text-nk-ivory transition-colors hover:bg-nk-gold"
        >
          Ingresar
        </button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nk-ivory px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco">
          Acceso restringido
        </p>
        <p className="text-sm text-nk-muted">Esta sección es solo para administradores.</p>
        <Link to="/" className="rounded-full bg-nk-choco px-6 py-3 text-sm font-semibold text-nk-ivory">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return children
}

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <Gate>
      <div className="min-h-screen bg-nk-ivory">
        <div className="h-20" />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
          <div className="mb-6">
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="mb-1 text-[10px] tracking-[4px] text-nk-gold">
              NUDA KETO · ADMIN
            </p>
            <p className="text-sm text-nk-muted">
              Hola, <span className="font-semibold text-nk-choco">{user?.name}</span>
            </p>
          </div>

          {/* Navegación: barra lateral en desktop, pastillas con scroll en móvil */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <nav className="lg:w-52 lg:shrink-0">
              <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
                {NAV.map((item) => (
                  <li key={item.to} className="shrink-0 lg:shrink">
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 whitespace-nowrap rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium transition-all lg:w-full ${
                          isActive
                            ? 'border-nk-choco bg-nk-choco text-nk-ivory'
                            : 'border-nk-arena bg-white text-nk-muted hover:border-nk-choco hover:text-nk-choco'
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <main className="min-w-0 flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </Gate>
  )
}
