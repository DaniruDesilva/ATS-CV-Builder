'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanTier =
  | 'free'
  | 'pro_monthly'
  | 'pro_quarterly'
  | 'lifetime'
  | 'lifetime_executive'
  | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanTier;
  aiCredits: number;
  maxAiCredits: number;
  pdfExportsUsed: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: { email: string; name?: string; plan?: PlanTier }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  upgradePlan: (
    tier: 'pro_monthly' | 'pro_quarterly' | 'lifetime' | 'lifetime_executive'
  ) => void;
  useAiCredit: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: ({ email, name, plan }) => {
        const fallbackName = name || email.split('@')[0] || 'User';
        const formattedName = fallbackName
          .split(/[._-]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');

        const chosenPlan: PlanTier = plan || 'free';
        let initialCredits = 5;
        if (chosenPlan === 'lifetime_executive') initialCredits = 1000;
        else if (chosenPlan === 'lifetime') initialCredits = 300;
        else if (chosenPlan === 'pro_quarterly') initialCredits = 450;
        else if (chosenPlan === 'pro_monthly' || chosenPlan === 'pro') initialCredits = 150;

        const user: User = {
          id: `usr_${Date.now()}`,
          email,
          name: formattedName,
          plan: chosenPlan,
          aiCredits: initialCredits,
          maxAiCredits: initialCredits,
          pdfExportsUsed: 0,
          createdAt: new Date().toISOString(),
        };

        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      upgradePlan: (tier) => {
        set((state) => {
          let credits = 150;
          if (tier === 'pro_quarterly') credits = 450;
          if (tier === 'lifetime') credits = 300;
          if (tier === 'lifetime_executive') credits = 1000;

          if (!state.user) {
            const newUser: User = {
              id: `usr_${Date.now()}`,
              email: 'subscriber@resumai.pro',
              name: 'Pro Member',
              plan: tier,
              aiCredits: credits,
              maxAiCredits: credits,
              pdfExportsUsed: 0,
              createdAt: new Date().toISOString(),
            };
            return {
              user: newUser,
              isAuthenticated: true,
            };
          }

          return {
            user: {
              ...state.user,
              plan: tier,
              aiCredits: (state.user.aiCredits || 0) + credits,
              maxAiCredits: credits,
            },
            isAuthenticated: true,
          };
        });
      },

      useAiCredit: () => {
        let success = false;
        set((state) => {
          if (!state.user || (state.user.aiCredits ?? 0) <= 0) {
            return state;
          }
          success = true;
          return {
            user: {
              ...state.user,
              aiCredits: (state.user.aiCredits ?? 1) - 1,
            },
          };
        });
        return success;
      },
    }),
    {
      name: 'resumai-auth-storage',
    }
  )
);
