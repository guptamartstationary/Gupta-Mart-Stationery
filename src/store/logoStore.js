import { create } from 'zustand';
import { settingsApi } from '../lib/shopApi.js';

const useLogoStore = create((set, get) => ({
  logo: '/Logo/Applogo.png',
  loading: false,

  fetchLogo: async () => {
    const { loading } = get();
    if (loading) return;
    set({ loading: true });
    try {
      const logo = await settingsApi.getAppLogo();
      set({ logo });
    } catch {
      set({ logo: '/Logo/Applogo.png' });
    } finally {
      set({ loading: false });
    }
  },

  updateLogo: async (url) => {
    await settingsApi.updateAppLogo(url);
    set({ logo: url });
  },
}));

export default useLogoStore;

