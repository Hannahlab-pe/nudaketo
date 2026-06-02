import { useState } from 'react'
import LegalLayout from './LegalLayout'

const initialForm = {
  tipo: 'reclamo',
  nombre: '',
  dni: '',
  telefono: '',
  email: '',
  direccion: '',
  bien: 'producto',
  pedidoId: '',
  detalle: '',
  pedido: '',
}

export default function ComplaintsPage() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = `*LIBRO DE RECLAMACIONES — NUDA KETO*\n\n`
      + `*Tipo:* ${form.tipo.toUpperCase()}\n`
      + `*Nombre:* ${form.nombre}\n`
      + `*DNI/CE:* ${form.dni}\n`
      + `*Teléfono:* ${form.telefono}\n`
      + `*Email:* ${form.email}\n`
      + `*Dirección:* ${form.direccion}\n`
      + `*Tipo de bien:* ${form.bien}\n`
      + `*N° de pedido:* ${form.pedidoId || 'No indicado'}\n\n`
      + `*Detalle del ${form.tipo}:*\n${form.detalle}\n\n`
      + `*Pedido / Pretensión:*\n${form.pedido}`
    window.open(`https://wa.me/51999999999?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  const inputClass = 'w-full border border-nk-arena rounded-xl px-4 py-3 text-nk-choco text-sm bg-white focus:outline-none focus:border-nk-gold transition-colors placeholder:text-nk-arena'
  const labelClass = 'block text-nk-choco text-xs font-semibold mb-1.5 tracking-wide'

  return (
    <LegalLayout
      title="Libro de Reclamaciones"
      subtitle="Conforme a lo establecido en el Código de Protección y Defensa del Consumidor — Ley N° 29571"
    >
      {/* Aviso INDECOPI */}
      <div className="mb-8 p-5 rounded-2xl border-2 border-nk-gold/30 bg-nk-gold/5 flex gap-4">
        <div className="shrink-0 mt-1">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-nk-gold stroke-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p className="text-nk-choco font-semibold text-sm mb-1">Aviso importante</p>
          <p className="text-nk-muted text-sm leading-relaxed">
            La atención del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el <strong className="text-nk-choco">INDECOPI</strong>. El proveedor deberá dar respuesta al reclamo en un plazo no mayor de <strong className="text-nk-choco">30 días calendario</strong>.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-16 flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-nk-olive/15 border-2 border-nk-olive flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-nk-olive stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco">
            Reclamo enviado
          </h3>
          <p className="text-nk-muted text-sm max-w-sm text-center">
            Hemos recibido tu {form.tipo}. Te atenderemos en un plazo máximo de <strong className="text-nk-choco">30 días calendario</strong> conforme a la ley. Recibirás respuesta por WhatsApp.
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-xs tracking-wider">
            CÓDIGO: NKR-{Date.now().toString().slice(-6)}
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(initialForm) }}
            className="border border-nk-arena text-nk-muted px-5 py-2 rounded-full text-sm hover:border-nk-choco hover:text-nk-choco transition-colors"
          >
            Registrar otro reclamo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Tipo */}
          <div>
            <p className={labelClass}>TIPO DE SOLICITUD</p>
            <div className="flex gap-3">
              {[
                { value: 'queja', label: 'Queja', desc: 'Disconformidad no relacionada a productos o servicios' },
                { value: 'reclamo', label: 'Reclamo', desc: 'Disconformidad relacionada a productos o servicios' },
              ].map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`flex-1 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    form.tipo === value ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena bg-white hover:border-nk-gold/40'
                  }`}
                >
                  <input type="radio" name="tipo" value={value} checked={form.tipo === value} onChange={handleChange} className="sr-only" />
                  <p className="text-nk-choco font-semibold text-sm">{label}</p>
                  <p className="text-nk-muted text-xs mt-0.5">{desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Datos del consumidor */}
          <div>
            <p className={`${labelClass} mb-3`}>DATOS DEL CONSUMIDOR</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre completo *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre y apellidos" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>DNI / CE *</label>
                <input name="dni" value={form.dni} onChange={handleChange} required placeholder="Número de documento" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Teléfono *</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="+51 999 999 999" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Dirección *</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Dirección de domicilio" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Identificación del bien */}
          <div>
            <p className={`${labelClass} mb-3`}>IDENTIFICACIÓN DEL BIEN</p>
            <div className="flex gap-3 mb-4">
              {['producto', 'servicio'].map((v) => (
                <label key={v} className={`flex-1 cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${form.bien === v ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena bg-white'}`}>
                  <input type="radio" name="bien" value={v} checked={form.bien === v} onChange={handleChange} className="sr-only" />
                  <span className="text-nk-choco text-sm font-semibold capitalize">{v}</span>
                </label>
              ))}
            </div>
            <label className={labelClass}>N° de pedido (si aplica)</label>
            <input name="pedidoId" value={form.pedidoId} onChange={handleChange} placeholder="Ej: NKR-123456" className={inputClass} />
          </div>

          {/* Detalle */}
          <div>
            <label className={labelClass}>DESCRIPCIÓN DEL {form.tipo.toUpperCase()} *</label>
            <textarea
              name="detalle"
              value={form.detalle}
              onChange={handleChange}
              required
              rows={5}
              placeholder={`Describe detalladamente el motivo de tu ${form.tipo}...`}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Pedido */}
          <div>
            <label className={labelClass}>PEDIDO O PRETENSIÓN *</label>
            <textarea
              name="pedido"
              value={form.pedido}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Indica qué solución esperas recibir..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold transition-all duration-300 hover:scale-[1.01]"
          >
            Enviar {form.tipo} por WhatsApp
          </button>

          <p className="text-nk-muted text-xs text-center">
            Al enviar este formulario acepta que NUDA KETO tratará sus datos conforme a nuestra{' '}
            <a href="/politica-de-privacidad" className="text-nk-gold underline hover:text-nk-choco">Política de Privacidad</a>.
          </p>
        </form>
      )}
    </LegalLayout>
  )
}
