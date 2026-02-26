import { config } from '../config/env'
import mockServer from './mockServer'

/**
 * Enhanced API client with interceptors, error handling, and request caching
 */
class ApiClient {
  constructor() {
    this.baseUrl = config.apiBaseUrl
    this.timeout = config.apiTimeout
    this.useMockServer = config.enableMockServer
    this.requestInterceptors = []
    this.responseInterceptors = []
    this.requestCache = new Map()
  }

  /**
   * Add request interceptor (e.g., for auth headers)
   */
  addRequestInterceptor(fn) {
    this.requestInterceptors.push(fn)
    return () => {
      const idx = this.requestInterceptors.indexOf(fn)
      if (idx > -1) this.requestInterceptors.splice(idx, 1)
    }
  }

  /**
   * Add response interceptor (e.g., for error handling)
   */
  addResponseInterceptor(fn) {
    this.responseInterceptors.push(fn)
    return () => {
      const idx = this.responseInterceptors.indexOf(fn)
      if (idx > -1) this.responseInterceptors.splice(idx, 1)
    }
  }

  /**
   * Execute all request interceptors
   */
  async executeRequestInterceptors(config) {
    let result = config
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result)
    }
    return result
  }

  /**
   * Execute all response interceptors
   */
  async executeResponseInterceptors(response) {
    let result = response
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result)
    }
    return result
  }

  /**
   * Create cache key from request config
   */
  getCacheKey(method, url) {
    return `${method}:${url}`
  }

  /**
   * Main fetch method
   */
  async request({ method = 'GET', url, body = null, headers = {}, cache = false, timeout = this.timeout }) {
    // Check cache for GET requests
    if (cache && method === 'GET') {
      const cacheKey = this.getCacheKey(method, url)
      if (this.requestCache.has(cacheKey)) {
        if (config.isDev) console.log(`[ApiClient] Cache hit: ${cacheKey}`)
        return this.requestCache.get(cacheKey)
      }
    }

    try {
      // Prepare config
      let requestConfig = { method, url, body, headers, timeout }

      // Execute request interceptors
      requestConfig = await this.executeRequestInterceptors(requestConfig)

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null

      let response
      if (this.useMockServer) {
        // Use mock server for development
        const payload = requestConfig.body ? JSON.parse(JSON.stringify(requestConfig.body)) : null
        response = await mockServer.handleRequest({
          method: requestConfig.method,
          url: requestConfig.url,
          body: payload,
          headers: requestConfig.headers,
        })
      } else {
        // Use real HTTP fetch
        const fetchUrl = requestConfig.url.startsWith('http') 
          ? requestConfig.url 
          : `${this.baseUrl}${requestConfig.url}`
        
        const fetchOptions = {
          method: requestConfig.method,
          headers: {
            'Content-Type': 'application/json',
            ...requestConfig.headers,
          },
          signal: controller.signal,
        }

        if (requestConfig.body) {
          fetchOptions.body = JSON.stringify(requestConfig.body)
        }

        const res = await fetch(fetchUrl, fetchOptions)
        const data = await res.json()
        response = { status: res.status, data, ok: res.ok }
      }

      if (timeoutId) clearTimeout(timeoutId)

      // Check for errors
      if (!response || response.error || !response.ok) {
        const err = new Error(response?.message || 'Network error')
        err.status = response?.status || 500
        err.response = response
        throw err
      }

      // Execute response interceptors
      response = await this.executeResponseInterceptors(response)

      // Cache successful GET requests
      if (cache && method === 'GET') {
        const cacheKey = this.getCacheKey(method, url)
        this.requestCache.set(cacheKey, response.data)
      }

      return response.data
    } catch (err) {
      if (err.name === 'AbortError') {
        const error = new Error(`Request timeout after ${timeout}ms`)
        error.status = 408
        throw error
      }
      throw err
    }
  }

  /**
   * GET request
   */
  get(url, options = {}) {
    return this.request({ ...options, method: 'GET', url })
  }

  /**
   * POST request
   */
  post(url, body, options = {}) {
    return this.request({ ...options, method: 'POST', url, body })
  }

  /**
   * PUT request
   */
  put(url, body, options = {}) {
    return this.request({ ...options, method: 'PUT', url, body })
  }

  /**
   * PATCH request
   */
  patch(url, body, options = {}) {
    return this.request({ ...options, method: 'PATCH', url, body })
  }

  /**
   * DELETE request
   */
  delete(url, options = {}) {
    return this.request({ ...options, method: 'DELETE', url })
  }

  /**
   * Clear cache
   */
  clearCache(pattern = null) {
    if (!pattern) {
      this.requestCache.clear()
      return
    }
    for (const key of this.requestCache.keys()) {
      if (key.match(pattern)) {
        this.requestCache.delete(key)
      }
    }
  }
}

export const apiClient = new ApiClient()

/**
 * Default export for backward compatibility
 */
export async function apiFetch({ method = 'GET', url, body = null, headers = {} }) {
  const payload = body ? JSON.parse(JSON.stringify(body)) : null
  const res = await mockServer.handleRequest({ method, url, body: payload, headers })

  if (!res || res.error) {
    const err = new Error(res?.message || 'Network error')
    err.status = res?.status || 500
    throw err
  }

  return res.data
}

export default apiClient
