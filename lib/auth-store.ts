"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setTokens: (token: string, refreshToken: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false, // On commence à false pour éviter le flash de chargement si on n'a pas de token
            isAuthenticated: false,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                }),

            setTokens: (token, refreshToken) =>
                set({
                    token,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'kiriku-auth',
            onRehydrateStorage: () => (state) => {
                // Une fois réhydraté, si on a un token mais pas d'user, on garde isLoading à true
                // pour que le layout puisse appeler getCurrentUser()
                if (state) {
                    if (state.token && !state.user) {
                        state.setLoading(true);
                    } else {
                        state.setLoading(false);
                    }
                }
            },
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
            }),
        }
    )
);
