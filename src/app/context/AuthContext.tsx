import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, authAPI } from '../services/api';

// ============================================
// Types
// ============================================

export interface UserProfile {
  id: string;
  role: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAdmin: () => Promise<void>;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Helpers
// ============================================

/**
 * Returns true if the error is an AbortError (request cancelled).
 * These are benign in React 18 Strict Mode (double-mount cleanup).
 */
function isAbortError(err: unknown): boolean {
  return (
    err instanceof DOMException && err.name === 'AbortError'
  ) || (
    err instanceof Error && err.message.includes('signal is aborted')
  );
}

/**
 * Fetches the role for a given user from the `user_profiles` table.
 * Returns true if the role is 'admin', false otherwise.
 * This is a pure async function — no React state dependency.
 */
async function fetchIsAdmin(targetUser: User): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', targetUser.id)
      .single();

    if (error) {
      console.error('[Auth] Error fetching user profile:', error.message);
      return false;
    }

    const isAdmin = data?.role === 'admin';
    console.log('[Auth] Role check:', { userId: targetUser.id, role: data?.role, isAdmin });
    return isAdmin;
  } catch (err) {
    // Silently ignore AbortErrors (React 18 Strict Mode cleanup)
    if (isAbortError(err)) return false;
    console.error('[Auth] Unexpected error checking admin status:', err);
    return false;
  }
}

// ============================================
// Provider
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Ref to track the current user for the visibility handler
  const userRef = useRef<User | null>(null);

  // Keep userRef in sync
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ------------------------------------------
  // 1. Initialize session + listen for changes
  // ------------------------------------------
  useEffect(() => {
    let isMounted = true;

    // Check existing session on mount
    async function initSession() {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        // Bail if component was unmounted during await (React 18 Strict Mode)
        if (!isMounted) return;

        if (error) {
          console.error('[Auth] Error checking session:', error.message);
          return;
        }

        const currentUser = currentSession?.user ?? null;
        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          const adminResult = await fetchIsAdmin(currentUser);
          if (isMounted) setIsAdmin(adminResult);
        }
      } catch (error) {
        // Silently ignore AbortErrors from Strict Mode cleanup
        if (isAbortError(error)) return;
        console.error('[Auth] Error during session initialization:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Bail if component was unmounted
        if (!isMounted) return;

        try {
          console.log('[Auth] Auth state changed:', event);

          const newUser = newSession?.user ?? null;
          setSession(newSession);
          setUser(newUser);

          if (newUser) {
            const adminResult = await fetchIsAdmin(newUser);
            if (isMounted) setIsAdmin(adminResult);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          // Silently ignore AbortErrors
          if (isAbortError(err)) return;
          console.error('[Auth] Error in auth state change handler:', err);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ------------------------------------------
  // 2. Auto-refresh admin status on tab focus
  //    Catches role changes made while user was
  //    on another tab or by another admin.
  // ------------------------------------------
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && userRef.current) {
        fetchIsAdmin(userRef.current)
          .then(setIsAdmin)
          .catch(() => {}); // Swallow errors silently
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ------------------------------------------
  // Auth actions
  // ------------------------------------------

  async function signIn(email: string, password: string): Promise<void> {
    try {
      setLoading(true);
      const result = await authAPI.signIn(email, password);

      // Set state with the actual returned user (not from React state)
      setSession(result.session);
      setUser(result.user);

      // Fire admin check in the background — don't block navigation
      // The onAuthStateChange listener will also trigger a check,
      // so isAdmin updates as soon as the query resolves.
      fetchIsAdmin(result.user)
        .then((adminResult) => setIsAdmin(adminResult))
        .catch(() => {}); // Swallow — onAuthStateChange will retry
    } catch (error) {
      console.error('[Auth] Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, fullName?: string): Promise<void> {
    try {
      setLoading(true);
      await authAPI.signUp(email, password, fullName);
      // After signup, sign in the user
      await signIn(email, password);
    } catch (error) {
      console.error('[Auth] Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOutUser(): Promise<void> {
    // Clear local auth state FIRST so the UI responds immediately
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);

    // Fire Supabase sign-out in the background (don't block UI)
    supabase.auth.signOut().catch((err) => {
      if (!isAbortError(err)) {
        console.error('[Auth] Sign out API error:', err);
      }
    });
  }

  /**
   * Public method: re-check admin status for the current user.
   * Safe to call even if user is null.
   */
  async function checkAdminStatus(): Promise<void> {
    const currentUser = userRef.current;
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const adminResult = await fetchIsAdmin(currentUser);
    setIsAdmin(adminResult);
  }

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut: signOutUser,
        checkAdmin: checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
