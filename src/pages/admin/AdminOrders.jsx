import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { apiFetch, SessionExpiredError } from '../../lib/api'
import { money, fmtDate } from '../../lib/format'
import { IconStore, IconDelivery, IconPin, IconChat } from '../../components/icons'

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

const PAGE_SIZE = 20

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [productFilter, setProductFilter] = useState('ALL')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/orders/all')
      if (res.status === 403) throw new Error('No tienes permisos para ver este panel.')
      if (!res.ok) throw new Error('No se pudieron cargar los pedidos.')
      setOrders(await res.json())
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const changeStatus = async (orderId, status) => {
    const prev = orders.find((o) => o.id === orderId)?.status
    setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status } : o)))
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success('Estado actualizado')
    } catch (err) {
      setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status: prev } : o)))
      if (!(err instanceof SessionExpiredError)) toast.error('No se pudo actualizar el estado')
    }
  }

  const productOptions = useMemo(() => {
    const set = new Set()
    orders.forEach((o) => (o.items || []).forEach((i) => set.add(i.name)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [orders])

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
      default: sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return sorted
  }, [orders, filter, query, productFilter, sort])

  // Cualquier cambio de filtro vuelve a la primera página
  const [lastKey, setLastKey] = useState('')
  const key = `${filter}|${query}|${productFilter}|${sort}`
  if (key !== lastKey) { setLastKey(key); if (page !== 1) setPage(1) }

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filterTabs = [{ id: 'ALL', label: 'Todos' }, ...STATUS_OPTIONS]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco sm:text-3xl">
            Pedidos
          </h1>
          <p className="mt-0.5 text-xs text-nk-muted">{orders.length} en total</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-full border-2 border-nk-arena px-4 py-2.5 text-sm font-medium text-nk-choco transition-colors hover:border-nk-choco"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-3M20 15a8 8 0 01-14 3" />
          </svg>
          Actualizar
        </button>
      </div>

      {loading && <div className="py-20 text-center text-nk-muted">Cargando pedidos...</div>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="py-20 text-center text-nk-muted">
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="mb-1 text-xl text-nk-choco/60">
            Aún no hay pedidos
          </p>
          <p className="text-sm">Cuando alguien compre, aparecerá aquí.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-nk-muted">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cliente, correo, N° de pedido o producto..."
              className="w-full rounded-2xl border-2 border-nk-arena bg-white py-3 pl-11 pr-10 text-sm text-nk-choco transition-colors focus:border-nk-gold focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-nk-muted hover:text-nk-choco"
                aria-label="Limpiar búsqueda"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="flex-1 cursor-pointer rounded-2xl border-2 border-nk-arena bg-white px-4 py-2.5 text-sm text-nk-choco focus:border-nk-gold focus:outline-none"
            >
              <option value="ALL">Todos los productos</option>
              {productOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="cursor-pointer rounded-2xl border-2 border-nk-arena bg-white px-4 py-2.5 text-sm text-nk-choco focus:border-nk-gold focus:outline-none sm:min-w-52"
            >
              <option value="recent">Más recientes</option>
              <option value="old">Más antiguos</option>
              <option value="high">Mayor monto</option>
              <option value="low">Menor monto</option>
            </select>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {filterTabs.map((t) => {
              const count = t.id === 'ALL' ? orders.length : orders.filter((o) => o.status === t.id).length
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`shrink-0 rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filter === t.id
                      ? 'border-nk-choco bg-nk-choco text-nk-ivory'
                      : 'border-nk-arena bg-white text-nk-muted hover:border-nk-choco hover:text-nk-choco'
                  }`}
                >
                  {t.label} <span className="opacity-60">{count}</span>
                </button>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-nk-muted">
              <p className="text-sm">Sin resultados para tu búsqueda o filtro.</p>
              <button
                onClick={() => { setQuery(''); setFilter('ALL'); setProductFilter('ALL') }}
                className="mt-2 text-xs text-nk-gold underline"
              >
                Limpiar
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-nk-muted">
                Mostrando {visible.length} de {filtered.length}
              </p>

              <div className="flex flex-col gap-4">
                {visible.map((o) => {
                  const st = statusLabels[o.status] || statusLabels.PAID
                  return (
                    <div key={o.id} className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
                      <div className="mb-4 flex flex-col justify-between gap-3 border-b border-nk-arena pb-4 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-nk-choco">
                            {o.user?.name || 'Cliente'}{' '}
                            <span className="font-normal text-nk-muted">· {o.email}</span>
                          </p>
                          <p style={{ fontFamily: "'DM Mono', monospace" }} className="mt-0.5 text-[11px] text-nk-muted">
                            {fmtDate(o.createdAt)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <select
                            value={o.status}
                            onChange={(e) => changeStatus(o.id, e.target.value)}
                            style={{ fontFamily: "'DM Mono', monospace" }}
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-bold focus:border-nk-gold focus:outline-none ${st.cls}`}
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">
                            {money(o.totalCents)}
                          </span>
                        </div>
                      </div>

                      <ul className="flex flex-col gap-2">
                        {o.items.map((it) => (
                          <li key={it.id} className="flex items-center justify-between text-sm">
                            <span className="text-nk-choco">
                              <span className="font-semibold">{it.qty}×</span> {it.name}
                              <span className="text-xs text-nk-muted"> · {it.sizeId}</span>
                            </span>
                            <span className="text-nk-muted">{money(it.price * it.qty * 100)}</span>
                          </li>
                        ))}
                      </ul>

                      {o.sellerCode && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-nk-gold/30 bg-nk-gold/10 p-3 text-xs">
                          <span className="font-semibold text-nk-choco">Vendedor: {o.sellerCode}</span>
                          <span className="text-nk-muted">
                            Descuento -{money(o.discountCents || 0)} · Comisión {money(o.commissionCents || 0)}
                          </span>
                        </div>
                      )}

                      <div className="mt-4 rounded-xl border border-nk-arena bg-nk-ivory p-3.5">
                        {o.fulfillment === 'PICKUP' ? (
                          <p className="flex items-center gap-2 text-sm font-semibold text-nk-choco">
                            <IconStore /> Recojo en tienda
                          </p>
                        ) : (
                          <div className="flex flex-col gap-1 text-sm">
                            <p className="flex items-center gap-2 font-semibold text-nk-choco">
                              <IconDelivery /> Envío a domicilio
                              {o.shippingCents > 0 && (
                                <span className="font-normal text-nk-muted">· {money(o.shippingCents)}</span>
                              )}
                            </p>
                            {o.customerName && <p className="text-nk-choco">{o.customerName} · {o.phone}</p>}
                            <p className="text-nk-muted">
                              {o.address}{o.district ? `, ${o.district}` : ''}{o.city ? `, ${o.city}` : ''}
                            </p>
                            {o.reference && <p className="text-xs text-nk-muted">Ref: {o.reference}</p>}
                            <div className="mt-1 flex gap-3">
                              <a
                                href={o.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([o.address, o.district, o.city].filter(Boolean).join(', '))}`}
                                target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-nk-gold hover:underline"
                              >
                                <IconPin className="h-3.5 w-3.5" /> Ver en Google Maps
                              </a>
                              {o.phone && (
                                <a
                                  href={`https://wa.me/51${(o.phone || '').replace(/\D/g, '')}`}
                                  target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-nk-olive hover:underline"
                                >
                                  <IconChat className="h-3.5 w-3.5" /> WhatsApp
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-nk-arena">
                          Culqi: {o.culqiCharge}
                        </p>
                        <Link
                          to={`/admin/pedido/${o.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-nk-gold transition-all hover:gap-2"
                        >
                          Ver detalle
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-xl border-2 border-nk-arena px-4 py-2 text-xs font-semibold text-nk-choco transition-colors hover:border-nk-choco disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <span className="px-2 text-xs text-nk-muted">Página {page} de {pages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="rounded-xl border-2 border-nk-arena px-4 py-2 text-xs font-semibold text-nk-choco transition-colors hover:border-nk-choco disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
