/**
 * Performance monitoring utilities
 * Helps identify rendering issues and slow operations
 */

/**
 * Measure performance of an async function
 */
export async function measureAsync(name, fn) {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    }
    return result
  } catch (err) {
    const duration = performance.now() - start
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, err)
    throw err
  }
}

/**
 * Measure performance of a sync function
 */
export function measureSync(name, fn) {
  const start = performance.now()
  try {
    const result = fn()
    const duration = performance.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    }
    return result
  } catch (err) {
    const duration = performance.now() - start
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, err)
    throw err
  }
}

/**
 * Report Web Vitals (if available)
 */
export function reportWebVitals() {
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
}

/**
 * Component render profiler (for development)
 */
export function createRenderProfiler(componentName) {
  return {
    onRenderCallback: (id, phase, actualDuration) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Render Profile] ${componentName}:`, {
          id,
          phase,
          duration: `${actualDuration.toFixed(2)}ms`,
        })
      }
    },
  }
}

export default {
  measureAsync,
  measureSync,
  reportWebVitals,
  createRenderProfiler,
}
