export function validateRequired(v) {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return Boolean(v)
}

export function validateEmail(v) {
  if (!v) return false
  // simple regex for demo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function validateAmount(v) {
  const num = Number(v)
  return !Number.isNaN(num) && num > 0
}

export default { validateRequired, validateEmail, validateAmount }
