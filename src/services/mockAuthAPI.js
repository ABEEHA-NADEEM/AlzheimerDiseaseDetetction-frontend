// mockAuthAPI.js

let mockUser = null;

export const authAPI = {

  register: async (data) => {
    // simulate network delay
    await new Promise(r => setTimeout(r, 500));
    mockUser = { id: '1', ...data };
    localStorage.setItem('access_token', 'fake_token_123');
    return { success: true, user: mockUser };
  },

  login: async (email, password, role) => {
    await new Promise(r => setTimeout(r, 500));
    mockUser = { id: '1', name: 'John Doe', email, role };
    localStorage.setItem('access_token', 'fake_token_123');
    return { success: true, user: mockUser };
  },

  me: async () => {
    await new Promise(r => setTimeout(r, 300));
    if (!mockUser) return { error: 'Not logged in' };
    return { user: mockUser };
  },

  pendingDoctors: async () => {
    await new Promise(r => setTimeout(r, 300));
    return [
      { id: '101', name: 'Dr. Sarah Chen', email: 'sarah@example.com' },
      { id: '102', name: 'Dr. James Wilson', email: 'james@example.com' }
    ];
  },

  approveDoctor: async (userId) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, userId };
  },

  rejectDoctor: async (userId) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, userId };
  },
};
