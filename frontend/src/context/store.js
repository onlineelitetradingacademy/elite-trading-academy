import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, settingsAPI } from '../utils/api';

// ── AUTH STORE ────────────────────────────────────────────────────
export const useAuthStore = create(persist(
  (set, get) => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    isAuthenticated: false,

    setAuth: (user, token, refreshToken) => {
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      set({ user, token, refreshToken, isAuthenticated: true });
    },

    logout: async () => {
      try { await authAPI.logout(); } catch (_) {}
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    },

    updateUser: (updates) => set(state => ({ user: { ...state.user, ...updates } })),

    fetchMe: async () => {
      try {
        const { data } = await authAPI.getMe();
        set({ user: data.data, isAuthenticated: true });
      } catch (_) {
        set({ user: null, isAuthenticated: false });
      }
    },

    isAdmin:    () => ['admin'].includes(get().user?.role),
    isSubAdmin: () => ['admin', 'sub_admin'].includes(get().user?.role),
    isMentor:   () => ['admin', 'sub_admin', 'mentor'].includes(get().user?.role),
    hasPermission: (perm) => get().user?.role === 'admin' || get().user?.permissions?.[perm],
  }),
  { name: 'elite-auth', partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }) }
));

// ── SETTINGS STORE ────────────────────────────────────────────────
export const useSettingsStore = create((set) => ({
  settings: {},
  sliders: [],
  announcement: null,
  popups: [],
  isLoaded: false,

  fetchSettings: async () => {
    try {
      const [settingsRes, slidersRes, announcementRes, popupsRes] = await Promise.all([
        settingsAPI.getAll(),
        settingsAPI.getSliders(),
        settingsAPI.getAnnouncement(),
        settingsAPI.getPopups(),
      ]);
      set({
        settings: settingsRes.data.data,
        sliders: slidersRes.data.data,
        announcement: announcementRes.data.data,
        popups: popupsRes.data.data,
        isLoaded: true,
      });
    } catch (err) {
      console.error('Settings fetch error:', err);
      set({ isLoaded: true });
    }
  },

  getSetting: (key, fallback = '') => useSettingsStore.getState().settings[key] ?? fallback,
}));

// ── CART/CHECKOUT STORE ───────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  item: null,           // single item checkout
  coupon: null,
  discount: 0,

  setItem: (item) => set({ item, coupon: null, discount: 0 }),

  applyCoupon: (coupon, discount) => set({ coupon, discount }),

  clearCart: () => set({ item: null, coupon: null, discount: 0 }),

  getFinalPrice: () => {
    const { item, discount } = get();
    if (!item) return 0;
    return Math.max(item.price - discount, 0);
  },
}));
