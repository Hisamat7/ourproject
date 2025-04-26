import { create } from 'zustand'
import { User } from 'firebase/auth'
import { AuthError } from '../services/authService'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: AuthError | null
  actions: {
    setUser: (user: User | null) => void
    setLoading: (isLoading: boolean) => void
    setError: (error: AuthError | null) => void
    reset: () => void
  }
}

const initialState = {
  user: null,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  actions: {
    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    reset: () => set(initialState),
  },
}))

// Selector hooks
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useAuthActions = () => useAuthStore((state) => state.actions)