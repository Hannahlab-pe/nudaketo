import { useState, useRef, useId } from 'react'
import { VIZ, niceTicks, linePath } from './viz'

/**
 * Serie única en el tiempo: línea + relleno suave, con crosshair y tooltip.
 *
 * Una sola serie, así que no lleva leyenda: el título del panel la nombra.
 * Nunca se dibujan dos medidas de escalas distintas acá — para eso está el
 * selector Ingresos/Pedidos, que cambia la medida y el eje entero.
 */
export default function AreaTrend({
  data,               // [{ date, value }]
  formatValue,        // (v) => string
  formatTick,         // (v) => string
  color = VIZ.s1,
  height = 260,
  emptyLabel = 'Sin datos en este período',
}) {
  const gradId = useId()
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null) // índice del punto activo

  const PAD = { top: 16, right: 16, bottom: 28, left: 52 }
  const W = 720
  const H = height
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom

  const max = Math.max(...data.map((d) => d.value), 0)
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1] || 1

  const points = data.map((d, i) => ({
    ...d,
    x: PAD.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW),
    y: PAD.top + plotH - (d.value / top) * plotH,
  }))

  const path = linePath(points)
  const areaPath = points.length
    ? `${path} L${points[points.length - 1].x},${PAD.top + plotH} L${points[0].x},${PAD.top + plotH} Z`
    : ''

  // Índice más cercano al puntero, en coordenadas del viewBox
  const handleMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect || !points.length) return
    const x = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    let bestDist = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x)
      if (d < bestDist) { bestDist = d; best = i }
    })
    setHover(best)
  }

  const hasData = data.some((d) => d.value > 0)
  const active = hover != null ? points[hover] : null

  return (
    <div className="relative" ref={wrapRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height, fontFamily: 'Inter, system-ui, sans-serif' }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Evolución en el tiempo"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rejilla y eje Y — recesivos a propósito */}
        {ticks.map((t) => {
          const y = PAD.top + plotH - (t / top) * plotH
          return (
            <g key={t}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={VIZ.grid} strokeWidth="1" />
              <text
                x={PAD.left - 10} y={y + 4} textAnchor="end"
                fill={VIZ.muted} fontSize="11"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatTick(t)}
              </text>
            </g>
          )
        })}

        {hasData && (
          <>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </>
        )}

        {/* Línea base */}
        <line
          x1={PAD.left} y1={PAD.top + plotH} x2={W - PAD.right} y2={PAD.top + plotH}
          stroke={VIZ.axis} strokeWidth="1"
        />

        {/* Etiquetas del eje X: solo primera, media y última, para que no choquen */}
        {points.length > 0 &&
          [0, Math.floor(points.length / 2), points.length - 1]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((i) => (
              <text
                key={i}
                x={points[i].x} y={H - 8}
                textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
                fill={VIZ.muted} fontSize="11"
              >
                {formatTick === undefined ? '' : shortDay(points[i].date)}
              </text>
            ))}

        {/* Crosshair + punto activo */}
        {active && hasData && (
          <g pointerEvents="none">
            <line
              x1={active.x} y1={PAD.top} x2={active.x} y2={PAD.top + plotH}
              stroke={VIZ.axis} strokeWidth="1" strokeDasharray="3 3"
            />
            {/* Anillo de superficie para que el punto se despegue de la línea */}
            <circle cx={active.x} cy={active.y} r="6" fill={VIZ.surface} />
            <circle cx={active.x} cy={active.y} r="4.5" fill={color} />
          </g>
        )}

        {!hasData && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fill={VIZ.muted} fontSize="13">
            {emptyLabel}
          </text>
        )}
      </svg>

      {/* Tooltip en HTML: se lee mejor que un <text> dentro del SVG */}
      {active && hasData && (
        <div
          className="pointer-events-none absolute z-10 rounded-xl border border-nk-arena bg-white px-3 py-2 shadow-[0_6px_24px_rgba(75,53,39,0.14)]"
          style={{
            left: `${(active.x / W) * 100}%`,
            top: 0,
            transform: `translate(${active.x > W * 0.7 ? '-105%' : '10px'}, 4px)`,
          }}
        >
          <p className="text-[10px] tracking-wider text-nk-muted uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
            {longDay(active.date)}
          </p>
          <p className="text-nk-choco font-semibold text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatValue(active.value)}
          </p>
        </div>
      )}
    </div>
  )
}

function shortDay(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}
function longDay(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'long' })
}
