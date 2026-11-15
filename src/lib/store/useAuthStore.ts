'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

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
  isLoading: boolean;
  
  // Real Supabase Actions
  initAuth: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signInWithGoogle: (safeRedirect?: string) => Promise<{ error?: string }>;
  signInWithGoogleIdToken: (idToken: string, nonce?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;

  // Legacy/Store compatibility helpers
  login: (userData: { email: string; name?: string; plan?: PlanTier }) => void;
  updateUser: (data: Partial<User>) => void;
  upgradePlan: (
    tier: 'pro_monthly' | 'pro_quarterly' | 'lifetime' | 'lifetime_executive'
  ) => void;
  useAiCredit: () => boolean;
}

let authListenerSubscribed = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      initAuth: async () => {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            if (data.isAuthenticated && data.user) {
              set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }

          // Attach real-time auth state listener once
          if (!authListenerSubscribed && typeof window !== 'undefined') {
            authListenerSubscribed = true;
            const supabase = createClient();
            supabase.auth.onAuthStateChange(async (event, session) => {
              if (event === 'SIGNED_OUT' || !session) {
                set({ user: null, isAuthenticated: false, isLoading: false });
                if (typeof window !== 'undefined') {
                  try {
                    localStorage.removeItem('ats-resume-builder-store');
                    localStorage.removeItem('ats-resume-builder-store-v2');
                  } catch (_) {}
                }
              } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                const refreshedRes = await fetch('/api/auth/me');
                if (refreshedRes.ok) {
                  const refreshedData = await refreshedRes.json();
                  if (refreshedData.user) {
                    set({
                      user: refreshedData.user,
                      isAuthenticated: true,
                      isLoading: false,
                    });
                  }
                }
              }
            });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return { error: error.message };
          }

          if (data.user) {
            // Sync with backend Prisma
            const syncRes = await fetch('/api/auth/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.user.user_metadata?.full_name }),
            });

            if (syncRes.ok) {
              const syncData = await syncRes.json();
              set({
                user: syncData.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                user: {
                  id: data.user.id,
                  email: data.user.email!,
                  name: data.user.user_metadata?.full_name || email.split('@')[0],
                  plan: 'free',
                  aiCredits: 5,
                  maxAiCredits: 5,
                  pdfExportsUsed: 0,
                  createdAt: new Date().toISOString(),
                },
                isAuthenticated: true,
                isLoading: false,
              });
            }
          }

          return {};
        } catch (err: any) {
          return { error: err?.message || 'Failed to sign in' };
        }
      },

      signUpWithEmail: async (email: string, password: string, name?: string) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name || email.split('@')[0],
              },
            },
          });

          if (error) {
            return { error: error.message };
          }

          if (data.user) {
            // Sync with backend Prisma
            const syncRes = await fetch('/api/auth/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name }),
            });

            if (syncRes.ok) {
              const syncData = await syncRes.json();
              set({
                user: syncData.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                user: {
                  id: data.user.id,
                  email: data.user.email!,
                  name: name || email.split('@')[0],
                  plan: 'free',
                  aiCredits: 5,
                  maxAiCredits: 5,
                  pdfExportsUsed: 0,
                  createdAt: new Date().toISOString(),
                },
                isAuthenticated: true,
                isLoading: false,
              });
            }
          }

          return {};
        } catch (err: any) {
          return { error: err?.message || 'Failed to create account' };
        }
      },

      signInWithGoogle: async (safeRedirect?: string) => {
        try {
          const supabase = createClient();
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          const nextParam = safeRedirect ? `?next=${encodeURIComponent(safeRedirect)}` : '';
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${origin}/auth/callback${nextParam}`,
            },
          });

          if (error) {
            return { error: error.message };
          }
          return {};
        } catch (err: any) {
          return { error: err?.message || 'Failed to initialize Google login' };
        }
      },

      signInWithGoogleIdToken: async (idToken: string, nonce?: string) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
            nonce,
          });

          if (error) {
            return { error: error.message };
          }

          if (data.user) {
            const syncRes = await fetch('/api/auth/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.user.user_metadata?.full_name }),
            });

            if (syncRes.ok) {
              const syncData = await syncRes.json();
              set({
                user: syncData.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                user: {
                  id: data.user.id,
                  email: data.user.email!,
                  name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
                  avatarUrl: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                  plan: 'free',
                  aiCredits: 5,
                  maxAiCredits: 5,
                  pdfExportsUsed: 0,
                  createdAt: new Date().toISOString(),
                },
                isAuthenticated: true,
                isLoading: false,
              });
            }
          }

          return {};
        } catch (err: any) {
          return { error: err?.message || 'Failed to sign in with Google' };
        }
      },

      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (err) {
          console.error('Error signing out of Supabase:', err);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('ats-resume-builder-store');
              localStorage.removeItem('ats-resume-builder-store-v2');
            } catch (_) {}
            window.location.href = '/';
          }
        }
      },

      // Fallback compatibility for UI code
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
          isLoading: false,
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
      name: 'resumai_auth_storage',
    }
  )
);
