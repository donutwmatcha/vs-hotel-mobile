import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { supabase } from "../lib/supabase";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  points: number;
  total_stays: number;
  tier: string;
  member_since: string;
  avatar_id: number | null;
  avatar_url: string | null;
  email_subscribed: boolean;
}

interface CheckIn {
  id: string;
  checked_in_at: string;
  points_awarded: number;
  action: string;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  lastCheckIn: CheckIn | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  lastCheckIn: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<CheckIn | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(data);

    // Fetch today's latest check-in
    const today = new Date().toISOString().split("T")[0];
    const { data: ci } = await supabase
      .from("check_ins")
      .select("*")
      .eq("guest_id", userId)
      .gte("checked_in_at", today + "T00:00:00")
      .order("checked_in_at", { ascending: false })
      .limit(1)
      .single();
    setLastCheckIn(ci ?? null);
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLastCheckIn(null);
      }
      setLoading(false);
    });

    // Auto-refresh when app comes back to foreground
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) fetchProfile(session.user.id);
        });
      }
    };
    const appStateSub = AppState.addEventListener("change", handleAppState);

    return () => {
      subscription.unsubscribe();
      appStateSub.remove();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLastCheckIn(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, lastCheckIn, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
