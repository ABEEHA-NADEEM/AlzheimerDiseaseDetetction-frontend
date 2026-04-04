const BASE_URL = 'http://127.0.0.1:8000/api'

// ── Helper ────────────────────────────────────────────────
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
})

// ── Auth APIs ─────────────────────────────────────────────
export const authAPI = {

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  login: async (email, password, role) => {
    const res = await fetch(`${BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
    return res.json()
  },

  me: async () => {
    const res = await fetch(`${BASE_URL}/accounts/me/`, {
      headers: authHeaders(),
    })
    return res.json()
  },

  // ── Admin only ──────────────────────────────────────────
  pendingDoctors: async () => {
    const res = await fetch(`${BASE_URL}/accounts/pending-doctors/`, {
      headers: authHeaders(),
    })
    return res.json()
  },

  approveDoctor: async (userId) => {
    const res = await fetch(`${BASE_URL}/accounts/approve/${userId}/`, {
      method: 'POST',
      headers: authHeaders(),
    })
    return res.json()
  },

  rejectDoctor: async (userId) => {
    const res = await fetch(`${BASE_URL}/accounts/reject/${userId}/`, {
      method: 'POST',
      headers: authHeaders(),
    })
    return res.json()
  },

  allUsers: async () => {                              // ← now INSIDE the object
    const res = await fetch(`${BASE_URL}/accounts/users/`, {
      headers: authHeaders(),
    })
    return res.json()
  },

}  // ← closing bracket of authAPI object

