import { supabaseAdmin } from "./supabase-admin";
import { Profile } from "@/types/profile";

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getProfileById(
  id: string
): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
