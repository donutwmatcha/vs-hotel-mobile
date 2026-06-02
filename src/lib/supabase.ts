import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://crokaympzbbvjujmrsfc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyb2theW1wemJidmp1am1yc2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjA5MzIsImV4cCI6MjA5NDA5NjkzMn0.YnNNF-S6FxgI52K2N8wsQsbl-YxLnCsv2Q-Ew-85pGM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
