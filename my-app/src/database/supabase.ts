import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://xokpfaojwmkdcxfughho.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva3BmYW9qd21rZGN4ZnVnaGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzExNDUsImV4cCI6MjAzMjkwNzE0NX0.G8wJAiPgUEAayKP1ZTF50pOCAGtHM7j-DBbw7yvIVM4"
);
