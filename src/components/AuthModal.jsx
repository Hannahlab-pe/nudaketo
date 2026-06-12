import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../context/AuthContext'

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function IconEye({ show }) {
  return show ? (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-nk-choco text-xs font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm placeholder:text-nk-arena/80 transition-colors"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-nk-muted hover:text-nk-choco transition-colors"
          >
            <IconEye show={show} />
          </button>
        )}
      </div>
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const { login, notifySuccess } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      notifySuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField label="Correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" autoComplete="email" />
      <InputField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />

      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full py-3.5 rounded-xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="text-center text-nk-muted text-xs">
        ¿No tienes cuenta?{' '}
        <button type="button" onClick={onSwitch} className="text-nk-gold font-semibold hover:underline">
          Crear cuenta
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch }) {
  const { register, notifySuccess } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      notifySuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField label="Nombre completo" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" />
      <InputField label="Correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" autoComplete="email" />
      <InputField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
      <InputField label="Confirmar contraseña" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" autoComplete="new-password" />

      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full py-3.5 rounded-xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center text-nk-muted text-xs">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onSwitch} className="text-nk-gold font-semibold hover:underline">
          Ingresar
        </button>
      </p>
    </form>
  )
}

export default function AuthModal() {
  const { modalOpen, modalMode, setModalMode, closeModal } = useAuth()

  return (
    <AnimatePresence>
      {modalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[60] bg-nk-choco/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            className="fixed inset-0 z-[61] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-nk-ivory rounded-3xl shadow-[0_24px_64px_rgba(75,53,39,0.2)] w-full max-w-md pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-nk-arena">
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-[4px] mb-1">NUDA KETO</p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco">
                    {modalMode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-colors"
                >
                  <IconClose />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mx-7 mt-5 gap-1 bg-nk-arena/30 rounded-xl p-1">
                {[['login', 'Ingresar'], ['register', 'Crear cuenta']].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setModalMode(mode)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      modalMode === mode
                        ? 'bg-white text-nk-choco shadow-sm'
                        : 'text-nk-muted hover:text-nk-choco'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="px-7 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={modalMode}
                    initial={{ opacity: 0, x: modalMode === 'login' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: modalMode === 'login' ? 10 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {modalMode === 'login'
                      ? <LoginForm onSwitch={() => setModalMode('register')} />
                      : <RegisterForm onSwitch={() => setModalMode('login')} />
                    }
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <p className="text-center text-nk-muted/60 text-[10px] pb-5 px-7">
                Al continuar aceptas nuestros{' '}
                <a href="/terminos-y-condiciones" className="underline hover:text-nk-choco" onClick={closeModal}>Términos y Condiciones</a>
                {' '}y{' '}
                <a href="/politica-de-privacidad" className="underline hover:text-nk-choco" onClick={closeModal}>Política de Privacidad</a>.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
