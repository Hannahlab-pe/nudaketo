const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// El AuthContext registra aquí qué hacer cuando el backend responde 401.
let onUnauthorized = null

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export class SessionExpiredError extends Error {
  constructor() {
    super('Tu sesión expiró. Vuelve a iniciar sesión.')
    this.name = 'SessionExpiredError'
  }
}

/** Vencimiento del JWT en ms, o null si el token no trae un `exp` legible. */
function tokenExpiresAt(token) {
  try {
    const payload = token.split('.')[1]
    const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const at = tokenExpiresAt(token)
  return at !== null && at <= Date.now()
}

/**
 * fetch contra el backend. Adjunta el token guardado y, si el backend responde
 * 401 a una petición autenticada, avisa al AuthContext y corta con
 * SessionExpiredError para que la página no muestre un error genérico.
 */
export async function apiFetch(path, { auth = true, headers, ...opts } = {}) {
  const token = auth ? localStorage.getItem('nk_token') : null

  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (res.status === 401 && token) {
    onUnauthorized?.()
    throw new SessionExpiredError()
  }
  return res
}
