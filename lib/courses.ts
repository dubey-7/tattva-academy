import { supabase } from "./supabase-server";
import { supabaseAdmin } from "./supabase-admin";
import { Course } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("subject", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function createCourse(input: {
  subject: string;
  curriculum: string;
  description?: string;
}) {
  return supabaseAdmin.from("courses").insert(input).select().single();
}
