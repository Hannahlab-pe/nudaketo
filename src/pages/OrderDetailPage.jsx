import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconStore, IconDelivery, IconPin } from '../components/icons'
import { STORE } from '../config/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const STEPS = [
  { id: 'PAID', label: 'Pagado' },
  { id: 'PROCESSING', label: 'En preparación' },
  { id: 'SHIPPED', label: 'Enviado' },
  { id: 'DELIVERED', label: 'Entregado' },
]

function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const { token, isAuthenticated, openLogin } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 404) throw new Error('Pedido no encontrado')
      if (!res.ok) throw new Error('No se pudo cargar el pedido')
      setOrder(await res.json())
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [id, token])

  useEffect(() => { load() }, [load])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Detalle del pedido</p>
        <button onClick={() => openLogin()} className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">Ingresar</button>
      </div>
    )
  }

  const cancelled = order?.status === 'CANCELLED'
  const currentIdx = order ? STEPS.findIndex((s) => s.id === order.status) : -1

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
        <Link to="/mis-compras" className="flex items-center gap-1.5 text-nk-muted hover:text-nk-choco text-sm mb-6 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
          Mis compras
        </Link>

        {loading && <div className="py-24 text-center text-nk-muted">Cargando pedido...</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500 text-sm">{error}</div>}

        {order && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[3px] mb-1">PEDIDO #{order.id.slice(-6).toUpperCase()}</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl font-black text-nk-choco">Detalle del pedido</h1>
                <p className="text-nk-muted text-xs mt-1">{fmtDate(order.createdAt)}</p>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco">S/{(order.totalCents / 100).toFixed(2)}</span>
            </div>

            {/* Línea de tiempo de estado */}
            {cancelled ? (
              <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 mb-6 text-center text-red-500 font-semibold">Pedido cancelado</div>
            ) : (
              <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6 mb-6">
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-5">ESTADO DEL PEDIDO</p>
                <div className="flex items-center justify-between relative">
                  {STEPS.map((s, i) => {
                    const done = i <= currentIdx
                    return (
                      <div key={s.id} className="flex-1 flex flex-col items-center relative">
                        {i > 0 && <div className={`absolute top-3.5 right-1/2 w-full h-0.5 ${i <= currentIdx ? 'bg-nk-gold' : 'bg-nk-arena'}`} />}
                        <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 ${done ? 'bg-nk-gold border-nk-gold' : 'bg-white border-nk-arena'}`}>
                          {done ? (
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-nk-ivory stroke-[3]"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          ) : <span className="w-2 h-2 rounded-full bg-nk-arena" />}
                        </div>
                        <span className={`text-[10px] sm:text-xs mt-2 text-center ${done ? 'text-nk-choco font-semibold' : 'text-nk-muted'}`}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Productos */}
            <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6 mb-4">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-4">PRODUCTOS</p>
              <ul className="flex flex-col gap-2.5">
                {order.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between text-sm">
                    <span className="text-nk-choco"><span className="font-semibold">{it.qty}×</span> {it.name} <span className="text-nk-muted text-xs">· {it.sizeId}</span></span>
                    <span className="text-nk-muted">S/{(it.price * it.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-nk-arena mt-4 pt-3 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between"><span className="text-nk-muted">Envío</span><span className="text-nk-choco">{order.shippingCents > 0 ? `S/${(order.shippingCents / 100).toFixed(2)}` : 'Gratis'}</span></div>
                <div className="flex justify-between font-semibold"><span className="text-nk-choco">Total</span><span className="text-nk-choco">S/{(order.totalCents / 100).toFixed(2)}</span></div>
              </div>
            </div>

            {/* Entrega */}
            <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">ENTREGA</p>
              {order.fulfillment === 'PICKUP' ? (
                <div className="text-sm flex flex-col gap-1">
                  <p className="text-nk-choco flex items-center gap-2"><IconStore /> Recojo en tienda</p>
                  <p className="text-nk-choco font-semibold mt-1">{STORE.name}</p>
                  <p className="text-nk-muted">{STORE.address}</p>
                  <p className="text-nk-muted text-xs">{STORE.hours}</p>
                  <a href={STORE.mapsLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-nk-gold font-semibold text-xs mt-1"><IconPin className="w-3.5 h-3.5" /> Ver en Google Maps</a>
                </div>
              ) : (
                <div className="text-sm text-nk-choco flex flex-col gap-1">
                  <p className="flex items-center gap-2"><IconDelivery /> Envío a domicilio</p>
                  {order.customerName && <p className="text-nk-muted">{order.customerName} · {order.phone}</p>}
                  <p className="text-nk-muted">{order.address}{order.district ? `, ${order.district}` : ''}{order.city ? `, ${order.city}` : ''}</p>
                  {order.reference && <p className="text-nk-muted text-xs">Ref: {order.reference}</p>}
                  {order.mapsLink && <a href={order.mapsLink} target="_blank" rel="noreferrer" className="text-nk-gold underline text-xs mt-1 inline-flex items-center gap-1"><IconPin className="w-3.5 h-3.5" /> Ver ubicación en Maps</a>}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
