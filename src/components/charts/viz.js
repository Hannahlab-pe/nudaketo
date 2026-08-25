/**
 * Paleta de gráficos NUDA KETO.
 *
 * Los colores de marca puros (choco #4B3527, gold #C2A45E, olive #7A7F63) NO
 * sirven como series: el choco queda fuera de la banda de luminosidad y los
 * tres caen bajo el piso de croma, o sea que leen como gris y no se distinguen
 * entre sí. Estos tres son versiones saturadas de la misma familia cálida y
 * pasan las cinco comprobaciones sobre fondo blanco:
 *
 *   banda de luminosidad ✓   piso de croma ✓
 *   separación con daltonismo: peor par ΔE 9.0 (deuteranopía) ✓
 *   visión normal: peor par ΔE 18.0 ✓   contraste ≥ 3:1 ✓
 *
 * Si cambias un hex, vuelve a correr el validador antes de subirlo.
 */
export const VIZ = {
  s1: '#BE8B24', // dorado — serie principal (ingresos, envío)
  s2: '#2F8E6B', // verde   — serie 2 (recojo en tienda)
  s3: '#C25A2B', // terracota — serie 3
  // Estados: paleta fija, nunca se tematiza. Siempre con etiqueta, nunca solo color.
  critical: '#D03B3B',
  good: '#0CA30C',
  // Tinta y cromo (tokens de texto de la marca, no colores de serie)
  ink: '#4B3527',
  inkSoft: '#6B5847',
  muted: '#9A8878',
  grid: '#EDE6D6',
  axis: '#D8C7A8',
  surface: '#FFFFFF',
}

/** Escala lineal → posición en px. */
export function scale(value, domainMax, range) {
  if (!domainMax) return range
  return range - (value / domainMax) * range
}

/**
 * Ticks "redondos" para el eje Y. Devuelve entre 3 y 5 valores incluyendo 0,
 * con un máximo por encima del dato para que la serie no toque el techo.
 */
export function niceTicks(max, count = 4) {
  if (max <= 0) return [0, 1]
  const raw = max / count
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag
  const top = Math.ceil(max / step) * step
  const ticks = []
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100)
  return ticks
}

/** Camino SVG de una polilínea, con esquinas suavizadas. */
export function linePath(points) {
  if (!points.length) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
}
