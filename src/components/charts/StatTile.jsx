import { VIZ } from './viz'

function Delta({ pct }) {
  // Sin base de comparación no inventamos un porcentaje.
  if (pct === null || pct === undefined) {
    return <span className="text-[11px] text-nk-muted">sin período previo</span>
  }
  const up = pct >= 0
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold"
      style={{ color: up ? VIZ.good : VIZ.critical }}
    >
      {/* Flecha + signo: el color nunca carga el significado solo */}
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
        <path strokeLinecap="round" strokeLinejoin="round" d={up ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} />
      </svg>
      {up ? '+' : ''}{pct}%
    </span>
  )
}

export default function StatTile({ label, value, delta, hint, hero = false }) {
  return (
    <div className="rounded-2xl border border-nk-arena bg-white p-5">
      <p
        style={{ fontFamily: "'DM Mono', monospace" }}
        className="mb-1.5 text-[10px] tracking-[2px] text-nk-muted uppercase"
      >
        {label}
      </p>
      <p
        style={{ fontFamily: "'Playfair Display', serif" }}
        className={`font-black leading-none text-nk-choco ${hero ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {delta !== undefined && <Delta pct={delta} />}
        {hint && <span className="text-[11px] text-nk-muted">{hint}</span>}
      </div>
    </div>
  )
}
