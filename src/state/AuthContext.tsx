import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase'

interface AuthContextValue {
  user: User | null
  initializing: boolean
  isConfigured: boolean
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setInitializing(false)
    })
  }, [])

  function requireAuth() {
    if (!auth) throw new Error('Firebase isn’t configured yet — add your project credentials to .env.')
    return auth
  }

  const value: AuthContextValue = {
    user,
    initializing,
    isConfigured: isFirebaseConfigured,
    async signUpWithEmail(email, password) {
      await createUserWithEmailAndPassword(requireAuth(), email, password)
    },
    async signInWithEmail(email, password) {
      await signInWithEmailAndPassword(requireAuth(), email, password)
    },
    async signInWithGoogle() {
      await signInWithPopup(requireAuth(), googleProvider)
    },
    async signOutUser() {
      await signOut(requireAuth())
    },
    async deleteAccount() {
      const current = requireAuth().currentUser
      if (!current) throw new Error('Not signed in.')
      await deleteUser(current)
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
