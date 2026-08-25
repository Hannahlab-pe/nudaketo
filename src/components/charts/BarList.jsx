import { VIZ } from './viz'

/**
 * Ranking por magnitud: barras horizontales con etiqueta directa.
 *
 * Horizontal porque los nombres de producto son largos y en vertical habría
 * que rotarlos. Un solo tono: la longitud ya codifica la magnitud, pintar cada
 * barra de un color distinto sería codificar dos veces lo mismo y sugeriría
 * que el color significa algo.
 */
export default function BarList({
  items,              // [{ label, value, hint?, color? }]
  formatValue,
  emptyLabel = 'Todavía no hay datos',
  barColor = VIZ.s1,
}) {
  if (!items.length) {
    return <p className="py-10 text-center text-sm text-nk-muted">{emptyLabel}</p>
  }

  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((it) => {
        const pct = Math.max((it.value / max) * 100, 1.5)
        return (
          <li key={it.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-nk-choco">{it.label}</span>
              <span
                className="shrink-0 text-sm font-semibold text-nk-choco"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatValue(it.value)}
                {it.hint && <span className="ml-1.5 font-normal text-nk-muted">{it.hint}</span>}
              </span>
            </div>
            {/* Pista de la barra: mismo tono, muy claro — no es un segundo dato */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-nk-arena/35">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: it.color || barColor }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
