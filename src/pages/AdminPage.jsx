import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { IconStore, IconDelivery, IconPin, IconChat } from '../components/icons'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const STATUS_OPTIONS = [
  { id: 'PAID', label: 'Pagado' },
  { id: 'PROCESSING', label: 'En preparación' },
  { id: 'SHIPPED', label: 'Enviado' },
  { id: 'DELIVERED', label: 'Entregado' },
  { id: 'CANCELLED', label: 'Cancelado' },
]

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
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [productFilter, setProductFilter] = useState('ALL')
  const [sort, setSort] = useState('recent')

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

  const changeStatus = async (orderId, status) => {
    // Optimista: actualiza la UI al instante
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success('Estado actualizado')
    } catch {
      toast.error('No se pudo actualizar el estado')
      load()
    }
  }

  // Métricas
  const totalVentas = orders.reduce((acc, o) => acc + o.totalCents, 0) / 100
  const totalPedidos = orders.length

  // Productos únicos presentes en los pedidos (para el filtro por producto)
  const productOptions = useMemo(() => {
    const set = new Set()
    orders.forEach((o) => (o.items || []).forEach((i) => set.add(i.name)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [orders])

  // Estado + búsqueda + producto + orden
  const filtered = useMemo(() => {
    let list = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((o) => {
        const hay = [
          o.user?.name, o.customerName, o.email, o.phone, o.district,
          o.id?.slice(-6), ...(o.items || []).map((i) => i.name),
        ].filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      })
    }

    if (productFilter !== 'ALL') {
      list = list.filter((o) => (o.items || []).some((i) => i.name === productFilter))
    }

    const sorted = [...list]
    switch (sort) {
      case 'old': sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break
      case 'high': sorted.sort((a, b) => b.totalCents - a.totalCents); break
      case 'low': sorted.sort((a, b) => a.totalCents - b.totalCents); break
      default: sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // recent
    }
    return sorted
  }, [orders, filter, query, productFilter, sort])
  const filterTabs = [
    { id: 'ALL', label: 'Todos' },
    ...STATUS_OPTIONS.filter((s) => s.id !== 'CANCELLED'),
    { id: 'CANCELLED', label: 'Cancelado' },
  ]

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
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link to="/admin/vendedores" className="flex items-center gap-2 bg-nk-choco text-nk-ivory px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z"/></svg>
              Vendedores
            </Link>
            <button onClick={load} className="flex items-center gap-2 border-2 border-nk-arena hover:border-nk-choco text-nk-choco px-4 py-2.5 rounded-full text-sm font-medium transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-3M20 15a8 8 0 01-14 3"/></svg>
              Actualizar
            </button>
          </div>
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

        {/* Buscador */}
        {!loading && !error && orders.length > 0 && (
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-nk-muted pointer-events-none">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cliente, correo, N° de pedido o producto..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm placeholder:text-nk-arena transition-colors"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-nk-muted hover:text-nk-choco">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        )}

        {/* Filtro por producto + orden */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm cursor-pointer"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <option value="ALL">Todos los productos</option>
              {productOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm cursor-pointer sm:min-w-52"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <option value="recent">Más recientes</option>
              <option value="old">Más antiguos</option>
              <option value="high">Mayor monto</option>
              <option value="low">Menor monto</option>
            </select>
          </div>
        )}

        {/* Filtros por estado */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filterTabs.map((t) => {
              const count = t.id === 'ALL' ? orders.length : orders.filter((o) => o.status === t.id).length
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all ${
                    filter === t.id ? 'bg-nk-choco border-nk-choco text-nk-ivory' : 'border-nk-arena text-nk-muted hover:border-nk-choco hover:text-nk-choco'
                  }`}
                >
                  {t.label} <span className="opacity-60">{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && orders.length > 0 && filtered.length === 0 && (
          <div className="py-16 text-center text-nk-muted">
            <p className="text-sm">Sin resultados para tu búsqueda o filtro.</p>
            <button onClick={() => { setQuery(''); setFilter('ALL'); setProductFilter('ALL') }} className="text-nk-gold underline text-xs mt-2">Limpiar</button>
          </div>
        )}

        {/* Lista de pedidos */}
        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtered.map((o) => {
              const st = statusLabels[o.status] || statusLabels.PAID
              return (
                <div key={o.id} className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-nk-arena">
                    <div>
                      <p className="text-nk-choco font-semibold text-sm">{o.user?.name || 'Cliente'} <span className="text-nk-muted font-normal">· {o.email}</span></p>
                      <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[11px] mt-0.5">{fmtDate(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Selector de estado (logística) */}
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none focus:border-nk-gold ${st.cls}`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
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

                  {/* Vendedor (si hubo código) */}
                  {o.sellerCode && (
                    <div className="mt-4 rounded-xl bg-nk-gold/10 border border-nk-gold/30 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-nk-choco font-semibold">Vendedor: {o.sellerCode}</span>
                      <span className="text-nk-muted">
                        Descuento -S/{((o.discountCents || 0) / 100).toFixed(2)} · Comisión S/{((o.commissionCents || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Entrega */}
                  <div className="mt-4 rounded-xl bg-nk-ivory border border-nk-arena p-3.5">
                    {o.fulfillment === 'PICKUP' ? (
                      <p className="text-sm text-nk-choco font-semibold flex items-center gap-2">
                        <IconStore /> Recojo en tienda
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="text-nk-choco font-semibold flex items-center gap-2">
                          <IconDelivery /> Envío a domicilio {o.shippingCents > 0 && <span className="text-nk-muted font-normal">· S/{(o.shippingCents / 100).toFixed(2)}</span>}
                        </p>
                        {o.customerName && <p className="text-nk-choco">{o.customerName} · {o.phone}</p>}
                        <p className="text-nk-muted">{o.address}{o.district ? `, ${o.district}` : ''}{o.city ? `, ${o.city}` : ''}</p>
                        {o.reference && <p className="text-nk-muted text-xs">Ref: {o.reference}</p>}
                        <div className="flex gap-3 mt-1">
                          <a
                            href={o.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([o.address, o.district, o.city].filter(Boolean).join(', '))}`}
                            target="_blank" rel="noreferrer"
                            className="text-nk-gold hover:underline text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <IconPin className="w-3.5 h-3.5" /> Ver en Google Maps
                          </a>
                          {o.phone && (
                            <a href={`https://wa.me/51${(o.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-nk-olive hover:underline text-xs font-semibold inline-flex items-center gap-1">
                              <IconChat className="w-3.5 h-3.5" /> WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-arena text-[10px]">
                      Culqi: {o.culqiCharge}
                    </p>
                    <Link to={`/admin/pedido/${o.id}`} className="flex items-center gap-1 text-nk-gold hover:gap-2 text-xs font-semibold transition-all">
                      Ver detalle
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
