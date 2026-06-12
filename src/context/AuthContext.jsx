import { createContext, useContext, useState, useCallback, useRef } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nk_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('nk_token') || null)
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
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
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
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
