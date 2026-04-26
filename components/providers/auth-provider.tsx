"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function checkUserAndProfile(sessionUser: User | null) {
      if (!sessionUser) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) setUser(sessionUser);

      // Check profile constraints
      const { data: profile } = await supabase
        .from("profiles")
        .select("handle, display_name")
        .eq("id", sessionUser.id)
        .single();

      if (!mounted) return;

      const isOnboarding = window.location.pathname.startsWith("/onboarding");
      const needsOnboarding = !profile?.handle || !profile?.display_name?.trim();

      if (needsOnboarding && !isOnboarding) {
        window.location.href = "/onboarding";
        return; // loading remains true so we don't flash content before redirect
      }

      if (!needsOnboarding && isOnboarding) {
        window.location.href = "/";
        return;
      }

      setLoading(false);
    }

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      checkUserAndProfile(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Re-check on sign in/out
      checkUserAndProfile(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext value={{ user, loading }}>
      {children}
    </AuthContext>
  );
}
