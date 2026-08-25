import { useState, useRef } from 'react'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { toast } from 'sonner'
import { apiFetch, SessionExpiredError, assetUrl, uploadImage } from '../../lib/api'
import { slugify } from '../../lib/format'

const CATEGORIES = [
  { id: 'tortas', label: 'Tortas' },
  { id: 'cuchareables', label: 'Cuchareables' },
  { id: 'galletones', label: 'Galletones' },
  { id: 'barras', label: 'Barras' },
  { id: 'bites', label: 'Keto Bites' },
]

// Combinaciones de color de la marca, para no pedirle clases de Tailwind al cliente
const THEMES = [
  { id: 'gold', label: 'Dorado', accentClass: 'text-nk-gold', btnClass: 'bg-nk-choco hover:bg-nk-gold text-nk-ivory', cardBg: 'bg-white', swatch: '#C2A45E' },
  { id: 'choco', label: 'Chocolate', accentClass: 'text-nk-choco', btnClass: 'bg-nk-choco hover:bg-nk-gold text-nk-ivory', cardBg: 'bg-nk-ivory2', swatch: '#4B3527' },
  { id: 'olive', label: 'Oliva', accentClass: 'text-nk-olive', btnClass: 'bg-nk-olive hover:bg-nk-choco text-nk-ivory', cardBg: 'bg-white', swatch: '#7A7F63' },
]

const EMPTY = {
  slug: '', name: '', category: 'cuchareables', tagline: '',
  image: '', imageDetail: '', shortDesc: '', description: '',
  highlights: [], ingredients: [],
  nutriServing: '', nutriKcal: '', nutriFat: '', nutriCarbs: '', nutriProtein: '',
  badge: '', accentClass: THEMES[0].accentClass, btnClass: THEMES[0].btnClass, cardBg: THEMES[0].cardBg,
  protein: '', netWeight: '', packaging: '', refrigerated: false, stock: '',
  active: true,
  sizes: [{ id: 'unico', label: 'Vaso individual', size: '1 unidad', pieces: 'Vaso individual', price: 0 }],
}

const inputCls =
  'w-full rounded-xl border-2 border-nk-arena bg-white px-3.5 py-2.5 text-sm text-nk-choco transition-colors focus:border-nk-gold focus:outline-none'
const labelCls = 'mb-1 block text-[11px] font-semibold text-nk-choco'

function Field({ label, hint, children }) {
  return (
    <div>
      <label className={labelCls} style={{ fontFamily: "'DM Mono', monospace" }}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-nk-muted">{hint}</p>}
    </div>
  )
}

/** Editor de una lista de textos (características / ingredientes). */
function ListEditor({ items, onChange, placeholder }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const v = draft.trim()
    if (!v) return
    onChange([...items, v])
    setDraft('')
  }
  return (
    <div>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-xl bg-nk-choco px-4 text-xs font-semibold text-nk-ivory transition-colors hover:bg-nk-gold"
        >
          Agregar
        </button>
      </div>
      {items.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <li
              key={`${it}-${i}`}
              className="flex items-center gap-1.5 rounded-full border border-nk-arena bg-white py-1 pl-3 pr-1.5 text-[11px] text-nk-choco"
            >
              {it}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-nk-muted transition-colors hover:text-red-500"
                aria-label={`Quitar ${it}`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Subida de imagen con vista previa. */
function ImageField({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const { url } = await uploadImage(file)
      onChange(url)
      toast.success('Imagen subida')
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) toast.error(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className={labelCls} style={{ fontFamily: "'DM Mono', monospace" }}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-nk-arena bg-nk-ivory2">
          {value ? (
            <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-nk-arena">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input ref={inputRef} type="file" accept="image/*" onChange={pick} className="hidden" />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border-2 border-nk-arena px-4 py-2 text-xs font-semibold text-nk-choco transition-colors hover:border-nk-choco disabled:opacity-60"
          >
            {busy ? 'Subiendo...' : value ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          <p className="mt-1.5 truncate text-[11px] text-nk-muted">
            {value || 'JPG, PNG o WebP · máximo 4 MB'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ProductEditor({ open, product, onClose, onSaved }) {
  const isNew = !product
  const [form, setForm] = useState(() => hydrate(product))
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('basico')

  // Reinicia el formulario cada vez que se abre con otro producto
  const [lastId, setLastId] = useState(product?.id ?? null)
  if (open && (product?.id ?? null) !== lastId) {
    setLastId(product?.id ?? null)
    setForm(hydrate(product))
    setTab('basico')
  }

  const set = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e
    setForm((f) => ({ ...f, [k]: v }))
  }

  const setSize = (i, key, value) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s, j) => (j === i ? { ...s, [key]: value } : s)),
    }))
  }

  const addSize = () =>
    setForm((f) => ({
      ...f,
      sizes: [...f.sizes, { id: `p${f.sizes.length + 1}`, label: '', size: '', pieces: '', price: 0 }],
    }))

  const removeSize = (i) =>
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, j) => j !== i) }))

  const save = async () => {
    const errors = validate(form)
    if (errors.length) { toast.error(errors[0]); return }

    setSaving(true)
    try {
      const payload = serialize(form)
      const res = await apiFetch(isNew ? '/products' : `/products/${product.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(
          Array.isArray(err.message) ? err.message[0] : err.message || 'No se pudo guardar',
        )
      }
      toast.success(isNew ? 'Producto creado' : 'Cambios guardados')
      onSaved(await res.json())
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const TABS = [
    ['basico', 'Básico'],
    ['precios', 'Precios'],
    ['detalle', 'Detalle'],
    ['nutricion', 'Nutrición'],
  ]

  return (
    <Dialog open={open} onClose={() => !saving && onClose()} className="relative z-[80]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-nk-choco/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <DialogPanel
          transition
          className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-nk-ivory shadow-[0_24px_64px_rgba(75,53,39,0.25)] duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between border-b border-nk-arena px-5 pb-4 pt-5 sm:px-6">
            <div className="min-w-0">
              <DialogTitle
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="truncate text-xl font-bold text-nk-choco"
              >
                {isNew ? 'Nuevo producto' : form.name || 'Editar producto'}
              </DialogTitle>
              {!isNew && <p className="mt-0.5 text-[11px] text-nk-muted">ID {product.id} · /{form.slug}</p>}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-nk-arena text-nk-muted transition-colors hover:border-nk-choco hover:text-nk-choco"
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pestañas */}
          <div className="flex gap-1 border-b border-nk-arena bg-nk-ivory px-5 sm:px-6">
            {TABS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`-mb-px border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                  tab === id ? 'border-nk-gold text-nk-choco' : 'border-transparent text-nk-muted hover:text-nk-choco'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Cuerpo */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {tab === 'basico' && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="NOMBRE">
                    <input
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setForm((f) => ({
                          ...f,
                          name,
                          // El slug se autogenera solo mientras sea un producto nuevo
                          slug: isNew ? slugify(name) : f.slug,
                        }))
                      }}
                      placeholder="Torta Keto de Vainilla"
                    />
                  </Field>
                  <Field label="ENLACE (SLUG)" hint={`nuda-keto.com/producto/${form.slug || '...'}`}>
                    <input className={inputCls} value={form.slug} onChange={set('slug')} placeholder="torta-vainilla" />
                  </Field>
                  <Field label="CATEGORÍA">
                    <select className={`${inputCls} cursor-pointer`} value={form.category} onChange={set('category')}>
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="ETIQUETA CORTA" hint="Se muestra sobre el nombre">
                    <input className={inputCls} value={form.tagline} onChange={set('tagline')} placeholder="Suave · Frutos rojos · Keto" />
                  </Field>
                </div>

                <Field label="DESCRIPCIÓN CORTA" hint="La que sale en la tarjeta de la tienda">
                  <textarea className={`${inputCls} resize-none`} rows={2} value={form.shortDesc} onChange={set('shortDesc')} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ImageField label="IMAGEN PRINCIPAL" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v, imageDetail: f.imageDetail || v }))} />
                  <ImageField label="IMAGEN DE DETALLE" value={form.imageDetail} onChange={(v) => setForm((f) => ({ ...f, imageDetail: v }))} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="INSIGNIA" hint="Vacío = sin insignia">
                    <input className={inputCls} value={form.badge} onChange={set('badge')} placeholder="NUEVO" />
                  </Field>
                  <Field label="STOCK" hint="Vacío = sin control">
                    <input type="number" min="0" className={inputCls} value={form.stock} onChange={set('stock')} placeholder="—" />
                  </Field>
                  <Field label="COLOR DE LA FICHA">
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={THEMES.find((t) => t.accentClass === form.accentClass && t.cardBg === form.cardBg)?.id || 'gold'}
                      onChange={(e) => {
                        const t = THEMES.find((x) => x.id === e.target.value)
                        if (t) setForm((f) => ({ ...f, accentClass: t.accentClass, btnClass: t.btnClass, cardBg: t.cardBg }))
                      }}
                    >
                      {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-nk-arena bg-white p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={form.refrigerated} onChange={set('refrigerated')} className="mt-0.5 h-4 w-4 accent-nk-gold" />
                    <span className="text-sm">
                      <span className="font-semibold text-nk-choco">Producto refrigerado</span>
                      <span className="block text-[11px] text-nk-muted">
                        Bloquea el envío a provincia. Solo Lima o recojo en tienda.
                      </span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={form.active} onChange={set('active')} className="mt-0.5 h-4 w-4 accent-nk-gold" />
                    <span className="text-sm">
                      <span className="font-semibold text-nk-choco">Visible en la tienda</span>
                      <span className="block text-[11px] text-nk-muted">
                        Si lo desmarcas deja de venderse, pero los pedidos antiguos se conservan.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {tab === 'precios' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-nk-muted">
                  Los precios se cobran desde acá: el servidor recalcula siempre el total con estos
                  valores, así que un cambio aplica al instante y no se puede manipular desde el navegador.
                </p>
                {form.sizes.map((s, i) => (
                  <div key={i} className="rounded-xl border border-nk-arena bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] tracking-wider text-nk-muted">
                        PRESENTACIÓN {i + 1}
                      </span>
                      {form.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(i)}
                          className="text-[11px] text-nk-muted underline transition-colors hover:text-red-500"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="NOMBRE">
                        <input className={inputCls} value={s.label} onChange={(e) => setSize(i, 'label', e.target.value)} placeholder="Torta completa" />
                      </Field>
                      <Field label="PRECIO (S/)">
                        <input
                          type="number" min="0" step="0.10"
                          className={inputCls}
                          value={s.price}
                          onChange={(e) => setSize(i, 'price', e.target.value)}
                        />
                      </Field>
                      <Field label="TAMAÑO">
                        <input className={inputCls} value={s.size} onChange={(e) => setSize(i, 'size', e.target.value)} placeholder="10–12 porciones" />
                      </Field>
                      <Field label="CONTENIDO">
                        <input className={inputCls} value={s.pieces} onChange={(e) => setSize(i, 'pieces', e.target.value)} placeholder="10 a 12 porciones" />
                      </Field>
                      <Field label="IDENTIFICADOR" hint="No lo cambies si ya se vendió: es lo que guardan los pedidos">
                        <input className={inputCls} value={s.id} onChange={(e) => setSize(i, 'id', e.target.value)} placeholder="completa" />
                      </Field>
                    </div>
                  </div>
                ))}
                {form.sizes.length < 6 && (
                  <button
                    type="button"
                    onClick={addSize}
                    className="rounded-xl border-2 border-dashed border-nk-arena py-3 text-sm font-semibold text-nk-muted transition-colors hover:border-nk-choco hover:text-nk-choco"
                  >
                    + Agregar presentación
                  </button>
                )}
              </div>
            )}

            {tab === 'detalle' && (
              <div className="flex flex-col gap-4">
                <Field label="DESCRIPCIÓN COMPLETA">
                  <textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={set('description')} />
                </Field>
                <Field label="CARACTERÍSTICAS" hint="Enter para agregar cada una">
                  <ListEditor items={form.highlights} onChange={(v) => setForm((f) => ({ ...f, highlights: v }))} placeholder="Sin azúcar añadida" />
                </Field>
                <Field label="INGREDIENTES" hint="Enter para agregar cada uno">
                  <ListEditor items={form.ingredients} onChange={(v) => setForm((f) => ({ ...f, ingredients: v }))} placeholder="Harina de almendra" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="PRESENTACIÓN"><input className={inputCls} value={form.packaging} onChange={set('packaging')} placeholder="Bolsa doypack resellable" /></Field>
                  <Field label="PESO NETO"><input className={inputCls} value={form.netWeight} onChange={set('netWeight')} placeholder="45g / 135g" /></Field>
                  <Field label="PROTEÍNA"><input className={inputCls} value={form.protein} onChange={set('protein')} placeholder="6g" /></Field>
                </div>
              </div>
            )}

            {tab === 'nutricion' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-nk-muted">
                  Si dejas los campos vacíos, la ficha del producto no muestra la tabla nutricional.
                </p>
                <Field label="PORCIÓN" hint="A qué cantidad corresponden los valores">
                  <input className={inputCls} value={form.nutriServing} onChange={set('nutriServing')} placeholder="1 galletón · 45 g" />
                </Field>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Field label="KCAL"><input type="number" min="0" className={inputCls} value={form.nutriKcal} onChange={set('nutriKcal')} placeholder="205" /></Field>
                  <Field label="GRASAS"><input className={inputCls} value={form.nutriFat} onChange={set('nutriFat')} placeholder="17 g" /></Field>
                  <Field label="CARBOS"><input className={inputCls} value={form.nutriCarbs} onChange={set('nutriCarbs')} placeholder="8 g" /></Field>
                  <Field label="PROTEÍNA"><input className={inputCls} value={form.nutriProtein} onChange={set('nutriProtein')} placeholder="6 g" /></Field>
                </div>
              </div>
            )}
          </div>

          {/* Pie */}
          <div className="flex items-center justify-end gap-3 border-t border-nk-arena bg-white px-5 py-4 sm:px-6">
            <button
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border-2 border-nk-arena px-5 py-2.5 text-sm font-semibold text-nk-choco transition-colors hover:border-nk-choco disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-nk-choco px-6 py-2.5 text-sm font-semibold text-nk-ivory transition-colors hover:bg-nk-gold disabled:opacity-60"
            >
              {saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────

function hydrate(p) {
  if (!p) return { ...EMPTY, sizes: EMPTY.sizes.map((s) => ({ ...s })) }
  return {
    slug: p.slug ?? '', name: p.name ?? '', category: p.category ?? 'cuchareables',
    tagline: p.tagline ?? '', image: p.image ?? '', imageDetail: p.imageDetail ?? '',
    shortDesc: p.shortDesc ?? '', description: p.description ?? '',
    highlights: p.highlights ?? [], ingredients: p.ingredients ?? [],
    nutriServing: p.nutrition?.serving ?? '',
    nutriKcal: p.nutrition?.kcal ?? '',
    nutriFat: p.nutrition?.fat ?? '',
    nutriCarbs: p.nutrition?.carbs ?? '',
    nutriProtein: p.nutrition?.protein ?? '',
    badge: p.badge ?? '', accentClass: p.accentClass ?? EMPTY.accentClass,
    btnClass: p.btnClass ?? EMPTY.btnClass, cardBg: p.cardBg ?? EMPTY.cardBg,
    protein: p.protein ?? '', netWeight: p.netWeight ?? '', packaging: p.packaging ?? '',
    refrigerated: !!p.refrigerated, stock: p.stock ?? '', active: p.active !== false,
    sizes: (p.sizes ?? []).map((s) => ({ ...s })),
  }
}

function validate(f) {
  const e = []
  if (!f.name.trim()) e.push('Ponle un nombre al producto')
  if (!f.slug.trim()) e.push('Falta el enlace (slug)')
  if (!f.image.trim()) e.push('Sube la imagen principal')
  if (!f.shortDesc.trim()) e.push('Falta la descripción corta')
  if (!f.description.trim()) e.push('Falta la descripción completa')
  if (!f.tagline.trim()) e.push('Falta la etiqueta corta')
  if (!f.packaging.trim()) e.push('Falta la presentación (pestaña Detalle)')
  if (!f.sizes.length) e.push('Agrega al menos una presentación con su precio')
  f.sizes.forEach((s, i) => {
    if (!s.id.trim()) e.push(`La presentación ${i + 1} necesita un identificador`)
    if (!s.label.trim()) e.push(`La presentación ${i + 1} necesita un nombre`)
    if (!(Number(s.price) > 0)) e.push(`La presentación ${i + 1} necesita un precio mayor a 0`)
  })
  const keys = f.sizes.map((s) => s.id.trim())
  if (new Set(keys).size !== keys.length) e.push('Hay dos presentaciones con el mismo identificador')
  return e
}

/** Formulario → payload de la API (strings vacíos pasan a null). */
function serialize(f) {
  const nz = (v) => (String(v ?? '').trim() === '' ? null : String(v).trim())
  return {
    slug: f.slug.trim(),
    name: f.name.trim(),
    category: f.category,
    tagline: f.tagline.trim(),
    image: f.image.trim(),
    imageDetail: (f.imageDetail || f.image).trim(),
    shortDesc: f.shortDesc.trim(),
    description: f.description.trim(),
    highlights: f.highlights,
    ingredients: f.ingredients,
    nutriServing: nz(f.nutriServing),
    nutriKcal: nz(f.nutriKcal) === null ? null : Number(f.nutriKcal),
    nutriFat: nz(f.nutriFat),
    nutriCarbs: nz(f.nutriCarbs),
    nutriProtein: nz(f.nutriProtein),
    badge: nz(f.badge),
    accentClass: f.accentClass,
    btnClass: f.btnClass,
    cardBg: f.cardBg,
    protein: nz(f.protein),
    netWeight: nz(f.netWeight),
    packaging: f.packaging.trim(),
    refrigerated: !!f.refrigerated,
    stock: nz(f.stock) === null ? null : Number(f.stock),
    active: !!f.active,
    sizes: f.sizes.map((s, i) => ({
      sizeKey: s.id.trim(),
      label: s.label.trim(),
      size: (s.size || '—').trim(),
      pieces: (s.pieces || s.label).trim(),
      price: Number(s.price),
      sortOrder: i,
    })),
  }
}
