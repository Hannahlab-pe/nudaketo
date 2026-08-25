import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, SessionExpiredError } from '../../lib/api'
import { money, moneyShort } from '../../lib/format'
import StatTile from '../../components/charts/StatTile'
import AreaTrend from '../../components/charts/AreaTrend'
import BarList from '../../components/charts/BarList'
import SplitBar from '../../components/charts/SplitBar'
import { VIZ } from '../../components/charts/viz'

const RANGES = [
  { days: 7, label: '7 días' },
  { days: 30, label: '30 días' },
  { days: 90, label: '90 días' },
  { days: 365, label: '1 año' },
]

const STATUS_LABEL = {
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

// Los estados son etapas de un flujo, no categorías independientes: una rampa
// ordinal del mismo tono. Cancelado sale del flujo, por eso lleva el rojo de
// estado — y siempre con su etiqueta al lado, nunca solo el color.
const STATUS_COLOR = {
  PAID: '#E3C88A',
  PROCESSING: '#D3AC55',
  SHIPPED: '#BE8B24',
  DELIVERED: '#8A6416',
  CANCELLED: VIZ.critical,
}

function Panel({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold text-nk-choco">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-nk-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function AdminDashboard() {
  const [days, setDays] = useState(30)
  const [measure, setMeasure] = useState('revenue') // revenue | orders
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch(`/admin/stats?days=${days}`)
      if (res.status === 403) throw new Error('No tienes permisos para ver estas métricas.')
      if (!res.ok) throw new Error('No se pudieron cargar las métricas.')
      setData(await res.json())
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => { load() }, [load])

  if (loading && !data) {
    return <div className="py-24 text-center text-nk-muted">Cargando métricas...</div>
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">
        {error}
      </div>
    )
  }
  if (!data) return null

  const k = data.kpis
  const series = data.series.map((d) => ({
    date: d.date,
    value: measure === 'revenue' ? d.revenueCents : d.orders,
  }))

  const statusRows = Object.entries(data.statusCounts)
    .map(([id, count]) => ({
      label: STATUS_LABEL[id] || id,
      value: count,
      color: STATUS_COLOR[id] || VIZ.s1,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="flex flex-col gap-5">

      {/* Rango de fechas — una sola fila de filtros, arriba de todo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco sm:text-3xl">
          Resumen
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all ${
                days === r.days
                  ? 'border-nk-choco bg-nk-choco text-nk-ivory'
                  : 'border-nk-arena bg-white text-nk-muted hover:border-nk-choco hover:text-nk-choco'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Ingresos" value={money(k.revenueCents)} delta={k.revenueDeltaPct} hero />
        <StatTile label="Pedidos" value={k.orders} delta={k.ordersDeltaPct} />
        <StatTile label="Ticket promedio" value={money(k.avgTicketCents)} />
        <StatTile label="Clientes" value={k.clients} hint={`${k.activeProducts} productos activos`} />
      </div>

      {/* Evolución */}
      <Panel
        title={measure === 'revenue' ? 'Ingresos por día' : 'Pedidos por día'}
        subtitle={`Últimos ${days} días · los pedidos cancelados no cuentan`}
        action={
          <div className="flex gap-1 rounded-xl bg-nk-arena/30 p-1">
            {[['revenue', 'Ingresos'], ['orders', 'Pedidos']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setMeasure(id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  measure === id ? 'bg-white text-nk-choco shadow-sm' : 'text-nk-muted hover:text-nk-choco'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      >
        <AreaTrend
          data={series}
          formatValue={(v) => (measure === 'revenue' ? money(v) : `${v} ${v === 1 ? 'pedido' : 'pedidos'}`)}
          formatTick={(v) => (measure === 'revenue' ? moneyShort(v) : String(v))}
        />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Top productos */}
        <Panel title="Productos más vendidos" subtitle={`Unidades vendidas en ${days} días`}>
          <BarList
            items={data.topProducts.map((p) => ({
              label: p.name,
              value: p.qty,
              hint: `· ${money(p.revenueCents)}`,
            }))}
            formatValue={(v) => `${v} u.`}
            emptyLabel="Sin ventas en este período"
          />
        </Panel>

        <div className="flex flex-col gap-5">
          {/* Entrega */}
          <Panel title="Cómo lo reciben" subtitle={`Pedidos de los últimos ${days} días`}>
            <SplitBar
              segments={[
                { label: 'Envío a domicilio', value: data.fulfillment.delivery, color: VIZ.s1 },
                { label: 'Recojo en tienda', value: data.fulfillment.pickup, color: VIZ.s2 },
              ]}
              formatValue={(v) => `${v}`}
            />
          </Panel>

          {/* Estados — histórico completo, no la ventana */}
          <Panel
            title="Estado de los pedidos"
            subtitle="Histórico completo"
            action={
              <Link to="/admin/pedidos" className="text-xs font-semibold text-nk-gold hover:underline">
                Ver pedidos
              </Link>
            }
          >
            <BarList
              items={statusRows}
              formatValue={(v) => `${v}`}
              emptyLabel="Aún no hay pedidos"
            />
          </Panel>
        </div>
      </div>

      <p className="text-center text-[11px] text-nk-muted">
        Histórico total: <strong className="text-nk-choco">{money(k.allTimeRevenueCents)}</strong> en{' '}
        {k.allTimeOrders} {k.allTimeOrders === 1 ? 'pedido' : 'pedidos'}
      </p>
    </div>
  )
}
