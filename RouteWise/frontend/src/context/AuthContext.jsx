import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../services/api.js'
import { AuthContext } from './AuthContext.js'

const STORAGE_KEY = 'routewise-auth'

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState(() => safeParse(localStorage.getItem(STORAGE_KEY)))

  useEffect(() => {
    if (authState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [authState])

  useEffect(() => {
    const handleExpiredSession = () => {
      setAuthState(null)
      toast.info('Your session expired. Please sign in again.')
      navigate('/login', { replace: true })
    }

    window.addEventListener('routewise:session-expired', handleExpiredSession)
    return () => window.removeEventListener('routewise:session-expired', handleExpiredSession)
  }, [navigate])

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    const nextState = {
      access: response.access,
      refresh: response.refresh,
      role: response.role,
      userId: response.user_id,
      email: credentials.email,
    }
    setAuthState(nextState)
    toast.success('Welcome back to RouteWise.')
    return nextState
  }

  const logout = async () => {
    try {
      if (authState?.access) {
        await authApi.logout()
      }
    } catch {
      // Clear local state regardless of backend response.
    } finally {
      setAuthState(null)
      toast.info('You have been signed out.')
      navigate('/login', { replace: true })
    }
  }

  const getDefaultRoute = (activeRole = authState?.role) => {
    if (activeRole === 'ADMIN') return '/admin/dashboard'
    if (activeRole === 'SALESPERSON') return '/sales/dashboard'
    if (activeRole === 'FINANCE') return '/finance/dashboard'
    return '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        getDefaultRoute,
        isAuthenticated: Boolean(authState?.access),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
