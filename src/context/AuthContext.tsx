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
  birthdate: string | null;
  birthday_bonus_year: number | null;
  member_number: number | null;
  lifetime_points: number | null;
  redeemed_points: number | null;
}

interface CheckInRecord {
  id: string;
  checked_in_at: string;
  points_awarded: number;
  action: string;
  room_type: string | null;
  room_number: string | null;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  lastCheckIn: CheckInRecord | null;
  lastCheckOut: CheckInRecord | null;
  currentRoom: CheckInRecord | null;
  loading: boolean;
  loadingMessage: string | null;
  setAppLoading: (loading: boolean, message?: string) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  lastCheckIn: null,
  lastCheckOut: null,
  currentRoom: null,
  loading: true,
  loadingMessage: null,
  setAppLoading: () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInRecord | null>(null);
  const [lastCheckOut, setLastCheckOut] = useState<CheckInRecord | null>(null);
  const [currentRoom, setCurrentRoom] = useState<CheckInRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  function setAppLoading(isLoading: boolean, message?: string) {
    setLoading(isLoading);
    setLoadingMessage(message ?? null);
  }

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(data);

    const today = new Date().toISOString().split("T")[0];

    const { data: ci } = await supabase
      .from("check_ins")
      .select("*")
      .eq("guest_id", userId)
      .eq("action", "Check-In")
      .gte("checked_in_at", today + "T00:00:00")
      .order("checked_in_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setLastCheckIn(ci ?? null);

    const { data: co } = await supabase
      .from("check_ins")
      .select("*")
      .eq("guest_id", userId)
      .eq("action", "Check-Out")
      .gte("checked_in_at", today + "T00:00:00")
      .order("checked_in_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setLastCheckOut(co ?? null);

    if (ci && ci.room_type && !co) {
      setCurrentRoom(ci);
    } else {
      setCurrentRoom(null);
    }
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
        setLastCheckOut(null);
        setCurrentRoom(null);
      }
      setLoading(false);
      setLoadingMessage(null);
    });

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
    setLastCheckOut(null);
    setCurrentRoom(null);
    setLoadingMessage(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        lastCheckIn,
        lastCheckOut,
        currentRoom,
        loading,
        loadingMessage,
        setAppLoading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
