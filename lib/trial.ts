import { supabase } from "./supabase-server";

import { TrialRegistration } from "@/types/trial";

export async function getTrialRegistrations(): Promise<
  TrialRegistration[]
> {
  const { data, error } = await supabase
    .from("trial_registrations")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}