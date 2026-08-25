/** Céntimos → "S/1,234.50" */
export function money(cents) {
  return `S/${(cents / 100).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** Céntimos → "S/1.2k" para ejes y espacios estrechos. */
export function moneyShort(cents) {
  const soles = cents / 100
  if (soles >= 1000) return `S/${(soles / 1000).toFixed(soles >= 10000 ? 0 : 1)}k`
  return `S/${Math.round(soles)}`
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function fmtDay(iso) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

export function fmtDayLong(iso) {
  return new Date(iso).toLocaleDateString('es-PE', {
    weekday: 'long', day: '2-digit', month: 'long',
  })
}

/** "hace 3 días" — para la última compra de un cliente. */
export function timeAgo(iso) {
  if (!iso) return '—'
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days <= 0) return 'hoy'
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`
  const years = Math.floor(months / 12)
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
