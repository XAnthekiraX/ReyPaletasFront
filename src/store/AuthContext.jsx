/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { authApi, privateAuthApi } from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEYS = {
  access: 'rey_paletas_access_token',
  refresh: 'rey_paletas_refresh_token',
  user: 'rey_paletas_user',
  expiresAt: 'rey_paletas_token_expires_at',
}

const TOKEN_EXPIRY_WARNING_MS = 10000

function getStoredAuth() {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEYS.access)
    const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh)
    const userStr = localStorage.getItem(TOKEN_KEYS.user)
    const expiresAt = localStorage.getItem(TOKEN_KEYS.expiresAt)

    if (accessToken && userStr) {
      return {
        user: JSON.parse(userStr),
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? parseInt(expiresAt, 10) : null,
      }
    }
  } catch (e) {
    console.error('Error reading auth from localStorage:', e)
  }
  return null
}

function calculateExpiresAt(expiresIn) {
  return Date.now() + expiresIn * 1000
}

function isTokenExpired(expiresAt) {
  if (!expiresAt) return true
  return Date.now() >= expiresAt
}

function isTokenExpiringSoon(expiresAt) {
  if (!expiresAt) return false
  return Date.now() >= expiresAt - TOKEN_EXPIRY_WARNING_MS
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getStoredAuth()
    return stored?.user || null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!getStoredAuth()?.accessToken
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showExpiryWarning, setShowExpiryWarning] = useState(false)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  
  const logoutRef = useRef(null)
  const refreshTokenRef = useRef(null)
  const intervalRef = useRef(null)

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem(TOKEN_KEYS.refresh)
    if (!storedRefreshToken) {
      return false
    }

    try {
      const response = await privateAuthApi.refreshToken(storedRefreshToken)
      if (response.status === 'success' && response.data) {
        const { access_token, refresh_token, expires_in } = response.data
        
        localStorage.setItem(TOKEN_KEYS.access, access_token)
        localStorage.setItem(TOKEN_KEYS.refresh, refresh_token)
        localStorage.setItem(TOKEN_KEYS.expiresAt, calculateExpiresAt(expires_in))
        
        setShowExpiryWarning(false)
        return true
      }
      return false
    } catch (err) {
      console.error('Token refresh failed:', err)
      return false
    }
  }, [])

  refreshTokenRef.current = refreshToken

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEYS.access)
    localStorage.removeItem(TOKEN_KEYS.refresh)
    localStorage.removeItem(TOKEN_KEYS.user)
    localStorage.removeItem(TOKEN_KEYS.expiresAt)

    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    setShowExpiryWarning(false)
    setShowExpiryModal(false)
  }, [])

  logoutRef.current = logout

  const checkAuth = useCallback(async () => {
    const accessToken = localStorage.getItem(TOKEN_KEYS.access)
    const storedUser = localStorage.getItem(TOKEN_KEYS.user)
    const expiresAt = localStorage.getItem(TOKEN_KEYS.expiresAt)
    const expiresAtNum = expiresAt ? parseInt(expiresAt, 10) : null

    if (!accessToken || !storedUser) {
      setIsLoading(false)
      return
    }

    if (isTokenExpired(expiresAtNum)) {
      const refreshed = await refreshTokenRef.current()
      if (!refreshed) {
        logoutRef.current()
        setIsLoading(false)
        return
      }
    }

    const userStr = localStorage.getItem(TOKEN_KEYS.user)
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
        setIsAuthenticated(true)
      } catch {
        logoutRef.current()
      }
    } else {
      logoutRef.current()
    }
    setIsLoading(false)
  }, [])

  const handleRefreshSession = useCallback(async () => {
    setShowExpiryWarning(false)
    const success = await refreshTokenRef.current()
    if (!success) {
      logoutRef.current()
    }
    return success
  }, [])

  const handleLogout = useCallback(() => {
    setShowExpiryModal(false)
    logoutRef.current()
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const checkTokenExpiry = () => {
      const expiresAt = localStorage.getItem(TOKEN_KEYS.expiresAt)
      const expiresAtNum = expiresAt ? parseInt(expiresAt, 10) : null

      if (!expiresAtNum) return

      if (isTokenExpired(expiresAtNum)) {
        setShowExpiryWarning(false)
        setShowExpiryModal(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else if (isTokenExpiringSoon(expiresAtNum)) {
        setShowExpiryWarning(true)
      } else {
        setShowExpiryWarning(false)
      }
    }

    checkTokenExpiry()
    intervalRef.current = setInterval(checkTokenExpiry, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAuthenticated])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login(email, password)
      
      if (response.access_token && response.refresh_token) {
        const { access_token, refresh_token, expires_in, user } = response

        localStorage.setItem(TOKEN_KEYS.access, access_token)
        localStorage.setItem(TOKEN_KEYS.refresh, refresh_token)
        localStorage.setItem(TOKEN_KEYS.user, JSON.stringify(user))
        localStorage.setItem(TOKEN_KEYS.expiresAt, calculateExpiresAt(expires_in))

        setUser(user)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (err) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    showExpiryWarning,
    showExpiryModal,
    handleRefreshSession,
    handleLogout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext