import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../api/client'

/**
 * Custom hook for making API calls with automatic loading and error handling
 * Usage: const { data, loading, error, call } = useApi()
 */
export function useApi() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = useCallback(async (apiMethod, ...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiMethod(...args)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      console.error('API Error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, call, reset }
}

/**
 * Hook to set up auth token interceptor
 */
export function useAuthApiInterceptor(token) {
  useEffect(() => {
    if (!token) return

    // Add request interceptor to add auth header
    const unsubscribe = apiClient.addRequestInterceptor((config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    })

    return unsubscribe
  }, [token])
}

export default useApi
