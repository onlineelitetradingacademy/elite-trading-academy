// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });
        localStorage.setItem('token', data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch (_) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  },
);

export default api;

// ── API HELPERS ───────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  login: (data) => api.post('/auth/login', data),
  sendPhoneOTP: (data) => api.post('/auth/phone-otp', data),
  verifyPhone: (data) => api.post('/auth/verify-phone', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) =>
    api.put(`/auth/reset-password/${token}`, data),
};

export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getOne: (slug) => api.get(`/courses/${slug}`),
  getMyCourses: () => api.get('/courses/my'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  togglePublish: (id) => api.patch(`/courses/${id}/publish`),
  addSection: (id, data) => api.post(`/courses/${id}/sections`, data),
  addLesson: (id, sId, data) =>
    api.post(`/courses/${id}/sections/${sId}/lessons`, data),
  updateLesson: (id, sId, lId, data) =>
    api.put(`/courses/${id}/sections/${sId}/lessons/${lId}`, data),
  markComplete: (lessonId) => api.post(`/courses/lessons/${lessonId}/complete`),
  bookmark: (lessonId) => api.post(`/courses/lessons/${lessonId}/bookmark`),
  addReview: (slug, data) => api.post(`/courses/${slug}/reviews`, data),
  adminGetAll: () => api.get('/courses/admin/all'),
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  getMyPayments: () => api.get('/payments/my'),
  getAll: (params) => api.get('/payments/all', { params }),
  getAnalytics: (params) => api.get('/payments/analytics', { params }),
};

export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getOne: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  adminGetAll: () => api.get('/blogs/admin/all'),
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getByGroup: (g) => api.get(`/settings/group/${g}`),
  update: (data) => api.put('/settings', data),
  bulkUpdate: (data) => api.put('/settings/bulk', data),
  getSliders: () => api.get('/settings/sliders'),
  getAllSliders: () => api.get('/settings/sliders/all'),
  createSlider: (data) => api.post('/settings/sliders', data),
  updateSlider: (id, d) => api.put(`/settings/sliders/${id}`, d),
  deleteSlider: (id) => api.delete(`/settings/sliders/${id}`),
  getPopups: () => api.get('/settings/popups'),
  getAllPopups: () => api.get('/settings/popups/all'),
  createPopup: (data) => api.post('/settings/popups', data),
  updatePopup: (id, d) => api.put(`/settings/popups/${id}`, d),
  deletePopup: (id) => api.delete(`/settings/popups/${id}`),
  getAnnouncement: () => api.get('/settings/announcement'),
  getAllAnnouncements: () => api.get('/settings/announcements/all'),
  createAnnouncement: (data) => api.post('/settings/announcements', data),
  updateAnnouncement: (id, d) => api.put(`/settings/announcements/${id}`, d),
  deleteAnnouncement: (id) => api.delete(`/settings/announcements/${id}`),
};

export const affiliateAPI = {
  apply: () => api.post('/affiliates/apply'),
  getMy: () => api.get('/affiliates/my'),
  trackClick: (code) => api.get(`/affiliates/track/${code}`),
  requestPayout: (data) => api.post('/affiliates/payout', data),
  getAll: () => api.get('/affiliates'),
  update: (id, d) => api.put(`/affiliates/${id}`, d),
  bypass: (userId) => api.post(`/affiliates/bypass/${userId}`),
  getPayouts: () => api.get('/affiliates/payouts/all'),
  processPayout: (id, d) => api.put(`/affiliates/payouts/${id}`, d),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, d) => api.put(`/users/${id}`, d),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: () => api.get('/users/admin/stats'),
};

export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
  create: (data) => api.post('/resources', data),
  update: (id, d) => api.put(`/resources/${id}`, d),
  delete: (id) => api.delete(`/resources/${id}`),
};

export const testimonialAPI = {
  getAll: (params) => api.get('/testimonials', { params }),
  create: (data) => api.post('/testimonials', data),
  update: (id, d) => api.put(`/testimonials/${id}`, d),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const franchiseAPI = {
  submit: (data) => api.post('/franchise', data),
  getAll: (p) => api.get('/franchise', { params: p }),
  update: (id, d) => api.put(`/franchise/${id}`, d),
};

export const batchAPI = {
  getAll: (p) => api.get('/batches', { params: p }),
  create: (data) => api.post('/batches', data),
  update: (id, d) => api.put(`/batches/${id}`, d),
  delete: (id) => api.delete(`/batches/${id}`),
};

export const webinarAPI = {
  getAll: () => api.get('/webinars'),
  getOne: (id) => api.get(`/webinars/${id}`),
  register: (id) => api.post(`/webinars/${id}/register`),
  create: (d) => api.post('/webinars', d),
  update: (id, d) => api.put(`/webinars/${id}`, d),
  delete: (id) => api.delete(`/webinars/${id}`),
};

export const couponAPI = {
  validate: (data) => api.post('/coupons/validate', data),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, d) => api.put(`/coupons/${id}`, d),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const galleryAPI = {
  getAll: (p) => api.get('/gallery', { params: p }),
  create: (data) => api.post('/gallery', data),
  update: (id, d) => api.put(`/gallery/${id}`, d),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const supportAPI = {
  create: (data) => api.post('/support', data),
  getAll: (p) => api.get('/support', { params: p }),
  getMy: () => api.get('/support/my'),
  reply: (id, d) => api.post(`/support/${id}/reply`, d),
  adminReply: (id, d) => api.post(`/support/${id}/reply`, d),
  update: (id, d) => api.patch(`/support/${id}/status`, d),
};

export const careerAPI = {
  getAll: () => api.get('/careers'),
  create: (data) => api.post('/careers', data),
  update: (id, d) => api.put(`/careers/${id}`, d),
  delete: (id) => api.delete(`/careers/${id}`),
};
