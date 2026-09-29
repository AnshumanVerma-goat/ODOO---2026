import { create } from 'zustand';
import { client } from '../api/client';
import { MOCK_PROFILE, USE_MOCK_DATA } from '../constants/config';
import { ElderlyProfile, User } from '../types';

type AuthState = {
  token: string | null;
  user: User;
  elderlyProfile: ElderlyProfile;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateElderlyProfile: (profile: ElderlyProfile) => void;
  completeOnboarding: () => void;
  logout: () => void;
};

const defaultUser: User = { id: 1, name: 'Caregiver', email: 'caregiver@nexguard.dev' };

export const useAuthStore = create<AuthState>((set) => ({
  token: USE_MOCK_DATA ? 'demo-token' : null,
  user: defaultUser,
  elderlyProfile: MOCK_PROFILE,
  isAuthenticated: USE_MOCK_DATA,
  hasCompletedOnboarding: USE_MOCK_DATA,

  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      set({ isAuthenticated: true, token: 'demo-token', user: { ...defaultUser, email } });
      return;
    }
    const res = await client.post('/api/v1/auth/login', { email, password });
    set({ token: res.data.access_token, user: res.data.user, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    if (USE_MOCK_DATA) {
      set({ isAuthenticated: true, token: 'demo-token', user: { id: 1, name, email } });
      return;
    }
    const res = await client.post('/api/v1/auth/register', { name, email, password });
    set({ token: res.data.access_token, user: res.data.user, isAuthenticated: true });
  },

  updateElderlyProfile: (profile) => set({ elderlyProfile: profile }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  logout: () =>
    set({
      token: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      user: defaultUser,
      elderlyProfile: MOCK_PROFILE,
    }),
}));
