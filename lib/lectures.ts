import { supabaseAdmin } from "./supabase-admin";
import { createClient } from "./supabase/server";
import { Lecture, LectureVisit } from "@/types/lecture";
import { Enrollment } from "@/types/enrollment";

export interface AdminLectureRow extends Lecture {
  visits: LectureVisit[];
  enrollment: Enrollment;
}

export interface StudentLectureRow extends Lecture {
  visit: LectureVisit | null;
  enrollment: Enrollment;
}

// Admin: every lecture with attendance visits + who it belongs to
export async function getAllLectures(): Promise<AdminLectureRow[]> {
  const { data, error } = await supabaseAdmin
    .from("lectures")
    .select(
      "*, visits:lecture_visits(*), enrollment:enrollments(*, course:courses(*), profile:profiles(*))"
    )
    .order("lecture_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as unknown as AdminLectureRow[]) ?? [];
}

// Student: their own lectures, with their own attendance visit resolved
export async function getMyLectures(): Promise<StudentLectureRow[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const uid = user?.id;

  const { data, error } = await supabase
    .from("lectures")
    .select(
      "*, enrollment:enrollments(*, course:courses(*)), visits:lecture_visits(*)"
    )
    .order("lecture_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((l) => {
    const row = l as unknown as AdminLectureRow;

    return {
      ...row,
      visit: row.visits?.find((v) => v.profile_id === uid) ?? null,
    };
  });
}

export async function createLecture(input: {
  enrollment_id: string;
  lecture_date: string;
  start_time: string;
  end_time: string;
  gmeet_link: string;
  topic?: string;
}) {
  return supabaseAdmin.from("lectures").insert(input).select().single();
}
