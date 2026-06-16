import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { IconStore, IconDelivery, IconPin, IconChat } from '../components/icons'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const STATUSES = [
  { id: 'PAID', label: 'Pagado' },
  { id: 'PROCESSING', label: 'En preparación' },
  { id: 'SHIPPED', label: 'Enviado' },
  { id: 'DELIVERED', label: 'Entregado' },
  { id: 'CANCELLED', label: 'Cancelado' },
]

function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const { token, isAuthenticated, isAdmin, openLogin } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 404) throw new Error('Pedido no encontrado')
      if (res.status === 403) throw new Error('No autorizado')
      if (!res.ok) throw new Error('No se pudo cargar el pedido')
      setOrder(await res.json())
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [id, token])

  useEffect(() => { load() }, [load])

  const changeStatus = async (status) => {
    setSaving(true)
    const prev = order.status
    setOrder((o) => ({ ...o, status }))
    try {
      const res = await fetch(`${API}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success('Estado actualizado')
    } catch {
      setOrder((o) => ({ ...o, status: prev }))
      toast.error('No se pudo actualizar')
    } finally { setSaving(false) }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Panel</p>
        <button onClick={() => openLogin()} className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold">Ingresar</button>
      </div>
    )
  }
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Acceso restringido</p>
        <Link to="/" className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold">Volver al inicio</Link>
      </div>
    )
  }

  const waPhone = order?.phone ? `51${order.phone.replace(/\D/g, '')}` : null
  const mapsHref = order?.mapsLink || (order ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([order.address, order.district, order.city].filter(Boolean).join(', '))}` : '#')

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
        <Link to="/admin" className="flex items-center gap-1.5 text-nk-muted hover:text-nk-choco text-sm mb-6 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
          Pedidos
        </Link>

        {loading && <div className="py-24 text-center text-nk-muted">Cargando...</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500 text-sm">{error}</div>}

        {order && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[3px] mb-1">PEDIDO #{order.id.slice(-6).toUpperCase()}</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-3xl font-black text-nk-choco">Gestión del pedido</h1>
                <p className="text-nk-muted text-xs mt-1">{fmtDate(order.createdAt)}</p>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco">S/{(order.totalCents / 100).toFixed(2)}</span>
            </div>

            {/* Cambiar estado */}
            <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6 mb-4">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">CAMBIAR ESTADO</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => changeStatus(s.id)}
                    disabled={saving}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all disabled:opacity-60 ${
                      order.status === s.id
                        ? 'bg-nk-choco border-nk-choco text-nk-ivory'
                        : 'border-nk-arena text-nk-muted hover:border-nk-choco hover:text-nk-choco'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cliente */}
            <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6 mb-4">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">CLIENTE</p>
              <p className="text-nk-choco font-semibold">{order.user?.name || order.customerName || 'Cliente'}</p>
              <p className="text-nk-muted text-sm">{order.email}{order.phone ? ` · ${order.phone}` : ''}</p>
              {waPhone && (
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 bg-nk-olive/10 border border-nk-olive/30 text-nk-olive px-3 py-2 rounded-full text-xs font-semibold hover:bg-nk-olive/20 transition-colors">
                  <IconChat className="w-3.5 h-3.5" /> Escribir por WhatsApp
                </a>
              )}
            </div>

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
            <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6 mb-4">
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">ENTREGA</p>
              {order.fulfillment === 'PICKUP' ? (
                <p className="text-sm text-nk-choco flex items-center gap-2"><IconStore /> Recojo en tienda</p>
              ) : (
                <div className="text-sm flex flex-col gap-1">
                  <p className="text-nk-choco flex items-center gap-2"><IconDelivery /> Envío a domicilio</p>
                  <p className="text-nk-muted">{order.address}{order.district ? `, ${order.district}` : ''}{order.city ? `, ${order.city}` : ''}</p>
                  {order.reference && <p className="text-nk-muted text-xs">Ref: {order.reference}</p>}
                  <a href={mapsHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-nk-gold font-semibold text-xs mt-1"><IconPin className="w-3.5 h-3.5" /> Ver en Google Maps</a>
                </div>
              )}
            </div>

            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-arena text-[10px]">Culqi: {order.culqiCharge}</p>
          </>
        )}
      </div>
    </div>
  )
}
