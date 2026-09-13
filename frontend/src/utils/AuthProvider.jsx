import React, { createContext, useContext, useEffect, useState } from 'react'
import { postLogin, postRegister } from '../api/endpoints'
import { apiClient } from '../api/client'
import mockServer from '../api/mockServer'

const AuthContext = createContext(null)

// Returns the JWT expiry in ms, or null when the token has no readable exp claim (e.g. mock tokens)
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch (e) {
    return null
  }
}

function loadStoredSession() {
  try {
    const s = localStorage.getItem('auth_user')
    const t = localStorage.getItem('auth_token')
    if (!s || !t) return null
    const expiry = getTokenExpiry(t)
    if (expiry !== null && expiry <= Date.now()) return null
    return { user: JSON.parse(s), token: t }
  } catch (e) {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session] = useState(loadStoredSession)
  const [user, setUser] = useState(session?.user ?? null)
  const [token, setToken] = useState(session?.token ?? null)

  useEffect(() => {
    if (!session) return
    // re-seed mock server token mapping so in-memory mock recognizes persisted token
    try {
      mockServer.registerToken(session.token, session.user)
    } catch (e) {}
  }, [session])

  // Log out when the token expires or the API rejects it
  useEffect(() => {
    if (!token) return
    apiClient.onUnauthorized = logout
    const expiry = getTokenExpiry(token)
    const timer = expiry !== null ? setTimeout(logout, Math.min(Math.max(expiry - Date.now(), 0), 2147483647)) : null
    return () => {
      if (timer) clearTimeout(timer)
      if (apiClient.onUnauthorized === logout) apiClient.onUnauthorized = null
    }
  }, [token])

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
  }, [user, token])

  async function login({ email, password }) {
    const res = await postLogin({ email, password })
    if (res && res.token) {
      setToken(res.token)
      setUser(res.user)
      try {
        mockServer.registerToken(res.token, res.user)
      } catch (e) {}
    }
    return res
  }

  async function register({ name, email, password }) {
    const res = await postRegister({ name, email, password })
    if (res && res.token) {
      setToken(res.token)
      setUser(res.user)
      try {
        mockServer.registerToken(res.token, res.user)
      } catch (e) {}
    }
    return res
  }

  function logout() {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
