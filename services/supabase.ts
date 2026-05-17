import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jgufdbtybwhvxcafbjmc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndWZkYnR5YndodnhjYWZiam1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODU2MjEsImV4cCI6MjA5Mzk2MTYyMX0.5C6QQeWj9i8NpRtlWyG67z3_Hspw2VqVBGzXblnh8fk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
