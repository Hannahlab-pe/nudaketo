import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import MapPicker, { parseLatLng } from '../components/MapPicker'

function Field({ label, value, onChange, placeholder, type = 'text', optional = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-nk-choco text-[11px] font-semibold flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace" }}>
        {label}{optional && <span className="text-nk-muted font-normal">(opcional)</span>}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm placeholder:text-nk-arena/80 transition-colors"
      />
    </div>
  )
}

export default function PerfilPage() {
  const { user, isAuthenticated, openLogin, saveProfile } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', address: '', district: '', city: '', reference: '', mapsLink: '', zone: 'lima' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name || '', phone: user.phone || '', address: user.address || '',
      district: user.district || '', city: user.city || '', reference: user.reference || '',
      mapsLink: user.mapsLink || '', zone: user.zone || 'lima',
    })
  }, [user])

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveProfile(form)
      toast.success('Datos guardados ✓')
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Mi perfil</p>
        <p className="text-nk-muted text-sm">Inicia sesión para ver y editar tus datos.</p>
        <button onClick={() => openLogin()} className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">Ingresar</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[4px] mb-2">MI CUENTA</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl font-black text-nk-choco">Mi perfil</h1>
          </div>
          <Link to="/mis-compras" className="text-nk-muted hover:text-nk-choco text-sm border-2 border-nk-arena hover:border-nk-choco px-4 py-2.5 rounded-full transition-colors">Mis compras</Link>
        </div>

        <div className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-7 flex flex-col gap-5">
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">DATOS PERSONALES</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="NOMBRE" value={form.name} onChange={setField('name')} placeholder="Tu nombre" />
              <Field label="TELÉFONO" type="tel" value={form.phone} onChange={setField('phone')} placeholder="999 999 999" />
            </div>
            <p className="text-nk-muted text-[11px] mt-2">Correo: {user.email}</p>
          </div>

          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-3">MI DIRECCIÓN DE ENVÍO</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Field label="DIRECCIÓN" value={form.address} onChange={setField('address')} placeholder="Av. / Calle y número" /></div>
              <Field label="DISTRITO" value={form.district} onChange={setField('district')} placeholder="Distrito" />
              <Field label="CIUDAD" value={form.city} onChange={setField('city')} placeholder="Ciudad" />
              <div className="sm:col-span-2"><Field label="REFERENCIA" value={form.reference} onChange={setField('reference')} placeholder="Cerca de..." optional /></div>
            </div>

            <div className="mt-3">
              <p className="text-nk-muted text-[11px] mb-2">Marca tu ubicación en el mapa:</p>
              <MapPicker height={220} initial={parseLatLng(user.mapsLink)} onSelect={({ lat, lng }) => setForm((f) => ({ ...f, mapsLink: `https://www.google.com/maps?q=${lat},${lng}` }))} />
              {form.mapsLink && (
                <a href={form.mapsLink} target="_blank" rel="noreferrer" className="text-nk-gold underline text-xs mt-2 inline-block">Ver ubicación en Maps</a>
              )}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-colors disabled:opacity-60">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <p className="text-nk-muted text-[11px] text-center">Estos datos autocompletan tu próxima compra. Podrás cambiarlos al pagar si lo necesitas.</p>
        </div>
      </div>
    </div>
  )
}
