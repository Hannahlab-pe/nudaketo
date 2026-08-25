import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { apiFetch, isTokenExpired, setUnauthorizedHandler } from '../lib/api'

const AuthContext = createContext(null)

/**
 * Lee la sesión guardada. Si el token ya venció la descarta, para no arrancar
 * la app "logueada" con un token muerto.
 */
function readStoredSession() {
  const token = localStorage.getItem('nk_token')
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('nk_token')
    localStorage.removeItem('nk_user')
    return { token: null, user: null }
  }
  try {
    return { token, user: JSON.parse(localStorage.getItem('nk_user')) }
  } catch {
    return { token, user: null }
  }
}

export function AuthProvider({ children }) {
  const [stored] = useState(readStoredSession)
  const [user, setUser] = useState(stored.user)
  const [token, setToken] = useState(stored.token)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('login')
  const successCb = useRef(null)

  const _persist = (data) => {
    localStorage.setItem('nk_token', data.token)
    localStorage.setItem('nk_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const login = useCallback(async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      auth: false,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Credenciales incorrectas')
    }
    const data = await res.json()
    _persist(data)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      auth: false,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'No se pudo crear la cuenta')
    }
    const data = await res.json()
    _persist(data)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nk_token')
    localStorage.removeItem('nk_user')
    setToken(null)
    setUser(null)
  }, [])

  // Mezcla y persiste cambios en el usuario (ej: dirección guardada)
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem('nk_user', JSON.stringify(next))
      return next
    })
  }, [])

  // Actualiza el perfil en el backend (nombre/dirección)
  const saveProfile = useCallback(async (fields) => {
    const res = await apiFetch('/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'No se pudo guardar el perfil')
    }
    const updated = await res.json()
    localStorage.setItem('nk_user', JSON.stringify(updated))
    setUser(updated)
    return updated
  }, [])

  const openLogin = useCallback((cb) => {
    successCb.current = cb ?? null
    setModalMode('login')
    setModalOpen(true)
  }, [])

  const openRegister = useCallback((cb) => {
    successCb.current = cb ?? null
    setModalMode('register')
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    successCb.current = null
  }, [])

  const notifySuccess = useCallback(() => {
    setModalOpen(false)
    if (successCb.current) {
      const fn = successCb.current
      successCb.current = null
      setTimeout(fn, 100)
    }
  }, [])

  // Token vencido: cierra la sesión y pide iniciar sesión de nuevo, en vez de
  // dejar al usuario ante un "no se pudo cargar" sin explicación.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      // Varias peticiones en paralelo pueden dar 401 a la vez; solo la primera avisa.
      if (!localStorage.getItem('nk_token')) return
      logout()
      toast.error('Tu sesión expiró. Vuelve a iniciar sesión.')
      openLogin()
    })
    return () => setUnauthorizedHandler(null)
  }, [logout, openLogin])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateUser,
        saveProfile,
        modalOpen,
        modalMode,
        setModalMode,
        openLogin,
        openRegister,
        closeModal,
        notifySuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
