import { apiFetch } from './client'

export async function getStats() {
  return apiFetch({ method: 'GET', url: '/api/stats' })
}

export async function getActivities({ limit } = {}) {
  const url = limit ? `/api/activities?limit=${limit}` : '/api/activities'
  return apiFetch({ method: 'GET', url })
}

export async function postDonation(payload) {
  // payload can include optional token via payload._token (internal)
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'POST', url: '/api/donations', body, headers })
}

export async function postVolunteer(payload) {
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'POST', url: '/api/volunteers', body, headers })
}

export async function postRegister(payload) {
  return apiFetch({ method: 'POST', url: '/api/register', body: payload })
}

export async function postLogin(payload) {
  return apiFetch({ method: 'POST', url: '/api/login', body: payload })
}

export async function createActivity(payload) {
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'POST', url: '/api/activities', body, headers })
}

export async function updateActivity(id, payload) {
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'PUT', url: `/api/activities/${id}`, body, headers })
}

export async function deleteActivity(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  return apiFetch({ method: 'DELETE', url: `/api/activities/${id}`, headers })
}

export async function joinActivity(id, payload) {
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'POST', url: `/api/activities/${id}/join`, body, headers })
}

export async function getParticipations(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  return apiFetch({ method: 'GET', url: '/api/participations', headers })
}

export async function patchParticipation(id, payload) {
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'PATCH', url: `/api/participations/${id}`, body, headers })
}

export async function postContact(payload) {
  return apiFetch({ method: 'POST', url: '/api/contact', body: payload })
}

export async function getContacts(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  return apiFetch({ method: 'GET', url: '/api/contacts', headers })
}

export async function getVolunteers(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  return apiFetch({ method: 'GET', url: '/api/volunteers', headers })
}

export async function patchVolunteer(id, payload) {
  const headers = payload && payload._token ? { Authorization: `Bearer ${payload._token}` } : {}
  const body = { ...payload }
  delete body._token
  return apiFetch({ method: 'PATCH', url: `/api/volunteers/${id}`, body, headers })
}

export default { getStats, getActivities, postDonation, postVolunteer }
