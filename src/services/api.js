// services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const getAccessToken  = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')

function authHeaders(isFormData = false) {
  const headers = { Authorization: `Bearer ${getAccessToken()}` }
  if (!isFormData) headers['Content-Type'] = 'application/json'
  return headers
}

async function request(url, options = {}) {
  let response = await fetch(`${BASE_URL}${url}`, options)

  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      }
      response = await fetch(`${BASE_URL}${url}`, options)
    } else {
      localStorage.clear()
      window.location.href = '/login'
      return
    }
  }

  // 204 No Content — no body to parse
  if (response.status === 204) return null

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || data.detail || 'Request failed')
  return data
}

async function refreshAccessToken() {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts/token/refresh/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh: getRefreshToken() }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('access_token', data.access)
    return true
  } catch {
    return false
  }
}

export const authAPI = {

  // ── Auth ────────────────────────────────────────────
  login: (email, password, role) =>
    request('/api/accounts/login/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, role }),
    }),

  register: (data) =>
    request('/api/accounts/register/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    }),

  me: () =>
    request('/api/accounts/me/', {
      headers: authHeaders(),
    }),

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  // ── Doctor ──────────────────────────────────────────
  predict: (formData) =>
    request('/api/diagnoses/predict/', {
      method:  'POST',
      headers: authHeaders(true),
      body:    formData,
    }),

  getDoctorReports: () =>
    request('/api/diagnoses/doctor/reports/', {
      headers: authHeaders(),
    }),

  getPatientList: () =>
    request('/api/diagnoses/patients/', {
      headers: authHeaders(),
    }),

  // ── Admin ───────────────────────────────────────────
  getPendingDoctors: () =>
    request('/api/accounts/pending-doctors/', {
      headers: authHeaders(),
    }),

  approveDoctor: (userId) =>
    request(`/api/accounts/approve/${userId}/`, {
      method:  'POST',
      headers: authHeaders(),
    }),

  rejectDoctor: (userId) =>
    request(`/api/accounts/reject/${userId}/`, {
      method:  'POST',
      headers: authHeaders(),
    }),

  getAllUsers: () =>
    request('/api/accounts/users/', {
      headers: authHeaders(),
    }),

  deleteUser: (userId) =>
    request(`/api/accounts/users/${userId}/delete/`, {
      method:  'DELETE',
      headers: authHeaders(),
    }),

  // ── Patient ─────────────────────────────────────────
  getPatientReports: () =>
    request('/api/diagnoses/patient/reports/', {
      headers: authHeaders(),
    }),

  // ── Shared ──────────────────────────────────────────
  getScanDetail: (scanId) =>
    request(`/api/diagnoses/scans/${scanId}/`, {
      headers: authHeaders(),
    }),
}