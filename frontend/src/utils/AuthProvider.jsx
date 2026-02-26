import React, { createContext, useContext, useEffect, useState } from 'react'
import { postLogin, postRegister } from '../api/endpoints'
import mockServer from '../api/mockServer'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const s = localStorage.getItem('auth_user')
    const t = localStorage.getItem('auth_token')
    if (s && t) {
      try {
        const parsed = JSON.parse(s)
        setUser(parsed)
        setToken(t)
        // re-seed mock server token mapping so in-memory mock recognizes persisted token
        try {
          mockServer.registerToken(t, parsed)
        } catch (e) {}
      } catch (e) {}
    }
  }, [])

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
