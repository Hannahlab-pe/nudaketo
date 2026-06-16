import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const statusLabels = {
  PAID: { label: 'Pagado', cls: 'bg-nk-olive/15 text-nk-olive border-nk-olive/30' },
  PROCESSING: { label: 'En proceso', cls: 'bg-nk-gold/15 text-nk-gold border-nk-gold/30' },
  SHIPPED: { label: 'Enviado', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  DELIVERED: { label: 'Entregado', cls: 'bg-green-50 text-green-600 border-green-200' },
  CANCELLED: { label: 'Cancelado', cls: 'bg-red-50 text-red-500 border-red-200' },
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPage() {
  const { token, isAuthenticated, isAdmin, openLogin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 403) throw new Error('No tienes permisos para ver este panel.')
      if (!res.ok) throw new Error('No se pudieron cargar los pedidos.')
      setOrders(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  // Métricas
  const totalVentas = orders.reduce((acc, o) => acc + o.totalCents, 0) / 100
  const totalPedidos = orders.length

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Panel de administración</p>
        <p className="text-nk-muted text-sm">Inicia sesión con tu cuenta de administrador.</p>
        <button onClick={() => openLogin()} className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">
          Ingresar
        </button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Acceso restringido</p>
        <p className="text-nk-muted text-sm">Esta sección es solo para administradores.</p>
        <Link to="/" className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[4px] mb-2">NUDA KETO · ADMIN</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl font-black text-nk-choco">
              Pedidos
            </h1>
          </div>
          <button onClick={load} className="self-start sm:self-auto flex items-center gap-2 border-2 border-nk-arena hover:border-nk-choco text-nk-choco px-4 py-2.5 rounded-full text-sm font-medium transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-3M20 15a8 8 0 01-14 3"/></svg>
            Actualizar
          </button>
        </div>

        {/* Métricas */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl border border-nk-arena bg-white p-5">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider mb-1">PEDIDOS TOTALES</p>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco">{totalPedidos}</p>
            </div>
            <div className="rounded-2xl border border-nk-arena bg-white p-5">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider mb-1">VENTAS TOTALES</p>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-gold">S/{totalVentas.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Estados */}
        {loading && (
          <div className="py-24 text-center text-nk-muted">Cargando pedidos...</div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-500 text-sm font-medium">{error}</p>
            <Link to="/" className="text-nk-gold underline text-xs mt-2 inline-block">Volver al inicio</Link>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="py-24 text-center text-nk-muted">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-nk-choco/60 mb-1">Aún no hay pedidos</p>
            <p className="text-sm">Cuando alguien compre, aparecerá aquí.</p>
          </div>
        )}

        {/* Lista de pedidos */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map((o) => {
              const st = statusLabels[o.status] || statusLabels.PAID
              return (
                <div key={o.id} className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-nk-arena">
                    <div>
                      <p className="text-nk-choco font-semibold text-sm">{o.user?.name || 'Cliente'} <span className="text-nk-muted font-normal">· {o.email}</span></p>
                      <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[11px] mt-0.5">{fmtDate(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${st.cls}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                        {st.label}
                      </span>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">
                        S/{(o.totalCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Productos */}
                  <ul className="flex flex-col gap-2">
                    {o.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between text-sm">
                        <span className="text-nk-choco">
                          <span className="font-semibold">{it.qty}×</span> {it.name}
                          <span className="text-nk-muted text-xs"> · {it.sizeId}</span>
                        </span>
                        <span className="text-nk-muted">S/{(it.price * it.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Entrega */}
                  <div className="mt-4 rounded-xl bg-nk-ivory border border-nk-arena p-3.5">
                    {o.fulfillment === 'PICKUP' ? (
                      <p className="text-sm text-nk-choco font-semibold flex items-center gap-2">
                        🏪 Recojo en tienda
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="text-nk-choco font-semibold flex items-center gap-2">
                          🛵 Envío a domicilio {o.shippingCents > 0 && <span className="text-nk-muted font-normal">· S/{(o.shippingCents / 100).toFixed(2)}</span>}
                        </p>
                        {o.customerName && <p className="text-nk-choco">{o.customerName} · {o.phone}</p>}
                        <p className="text-nk-muted">{o.address}{o.district ? `, ${o.district}` : ''}{o.city ? `, ${o.city}` : ''}</p>
                        {o.reference && <p className="text-nk-muted text-xs">Ref: {o.reference}</p>}
                        <div className="flex gap-3 mt-1">
                          <a
                            href={o.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([o.address, o.district, o.city].filter(Boolean).join(', '))}`}
                            target="_blank" rel="noreferrer"
                            className="text-nk-gold hover:underline text-xs font-semibold"
                          >
                            📍 Ver en Google Maps
                          </a>
                          {o.phone && (
                            <a href={`https://wa.me/51${(o.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-nk-olive hover:underline text-xs font-semibold">
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-arena text-[10px] mt-3">
                    Culqi: {o.culqiCharge}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
