/**
 * Environment configuration utility
 * Provides type-safe access to environment variables with fallbacks
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  enableMockServer: import.meta.env.VITE_ENABLE_MOCK_SERVER === 'true',
  appName: import.meta.env.VITE_APP_NAME || 'Humanitarac',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

export default config
