import { supabaseAdmin } from "./supabase-admin";
import { createClient } from "./supabase/server";
import { Enrollment } from "@/types/enrollment";

// Admin: every enrollment, with student + course info attached
export async function getAllEnrollments(): Promise<Enrollment[]> {
  const { data, error } = await supabaseAdmin
    .from("enrollments")
    .select("*, course:courses(*), profile:profiles(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as unknown as Enrollment[]) ?? [];
}

// Student: only their own enrollments (enforced by RLS as well)
export async function getMyEnrollments(): Promise<Enrollment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as unknown as Enrollment[]) ?? [];
}

export async function createEnrollment(input: {
  profile_id: string;
  course_id: string;
  fee_amount?: number;
  duration_weeks?: number;
  start_date?: string;
  notes?: string;
}) {
  return supabaseAdmin
    .from("enrollments")
    .insert({ ...input, status: "confirmed" })
    .select()
    .single();
}

export async function updateEnrollment(
  id: string,
  patch: Partial<{
    fee_amount: number;
    fee_status: string;
    duration_weeks: number;
    start_date: string;
    status: string;
    notes: string;
  }>
) {
  return supabaseAdmin.from("enrollments").update(patch).eq("id", id);
}
