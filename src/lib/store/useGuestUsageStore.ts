'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface GuestUsageState {
  // Counters for guest actions
  scanCount: number;
  bulletCount: number;
  keywordCount: number;
  exportCount: number;
  builderAiCount: number;

  // Actions to increment counts
  recordScan: () => void;
  recordBullet: () => void;
  recordKeyword: () => void;
  recordExport: () => void;
  recordBuilderAi: () => void;

  // Permission checkers
  // Authenticated users always have access. Guests get 1 free use per feature.
  canScan: (isAuthenticated: boolean) => boolean;
  canOptimizeBullet: (isAuthenticated: boolean) => boolean;
  canMatchKeywords: (isAuthenticated: boolean) => boolean;
  canExport: (isAuthenticated: boolean) => boolean;
  canUseBuilderAi: (isAuthenticated: boolean) => boolean;

  // Reset counters (e.g. after login/testing)
  resetUsage: () => void;
}

export const useGuestUsageStore = create<GuestUsageState>()(
  persist(
    (set, get) => ({
      scanCount: 0,
      bulletCount: 0,
      keywordCount: 0,
      exportCount: 0,
      builderAiCount: 0,

      recordScan: () => {
        set((state) => ({ scanCount: state.scanCount + 1 }));
      },

      recordBullet: () => {
        set((state) => ({ bulletCount: state.bulletCount + 1 }));
      },

      recordKeyword: () => {
        set((state) => ({ keywordCount: state.keywordCount + 1 }));
      },

      recordExport: () => {
        set((state) => ({ exportCount: state.exportCount + 1 }));
      },

      recordBuilderAi: () => {
        set((state) => ({ builderAiCount: state.builderAiCount + 1 }));
      },

      // Allowance checkers: 1 free trial for unauthenticated users, unlimited for authenticated
      canScan: (isAuthenticated: boolean) => {
        if (isAuthenticated) return true;
        return get().scanCount < 1;
      },

      canOptimizeBullet: (isAuthenticated: boolean) => {
        if (isAuthenticated) return true;
        return get().bulletCount < 1;
      },

      canMatchKeywords: (isAuthenticated: boolean) => {
        if (isAuthenticated) return true;
        return get().keywordCount < 1;
      },

      canExport: (isAuthenticated: boolean) => {
        if (isAuthenticated) return true;
        return get().exportCount < 1;
      },

      canUseBuilderAi: (isAuthenticated: boolean) => {
        if (isAuthenticated) return true;
        return get().builderAiCount < 1;
      },

      resetUsage: () => {
        set({
          scanCount: 0,
          bulletCount: 0,
          keywordCount: 0,
          exportCount: 0,
          builderAiCount: 0,
        });
      },
    }),
    {
      name: 'ats-guest-usage-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
