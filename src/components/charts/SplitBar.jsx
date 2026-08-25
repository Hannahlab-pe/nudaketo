

/**
 * Parte-sobre-el-todo con pocas categorías: una barra apilada, no un donut.
 * Dos segmentos separados por 2px de superficie, cada uno con su etiqueta
 * directa — la identidad no depende solo del color.
 */
export default function SplitBar({ segments, formatValue }) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  if (!total) {
    return <p className="py-8 text-center text-sm text-nk-muted">Todavía no hay pedidos</p>
  }

  return (
    <div>
      <div className="flex h-3.5 w-full gap-0.5 overflow-hidden rounded-full">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.label}: ${formatValue(s.value)}`}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-nk-choco">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="text-nk-choco" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <strong className="font-semibold">{formatValue(s.value)}</strong>
              <span className="ml-1.5 text-nk-muted">
                {Math.round((s.value / total) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
