export type Role = "student" | "teacher" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  grade: string | null;
  country: string | null;
  curriculum: string | null;
  role: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  subject: string;
  curriculum: string;
  description: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  profile_id: string | null;
  course_id: string | null;
  fee_amount: number | null;
  fee_status: string | null;
  duration_weeks: number | null;
  start_date: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

export interface EnrollmentWithCourse extends Enrollment {
  courses: Course | null;
}

export interface Lecture {
  id: string;
  enrollment_id: string | null;
  lecture_date: string;
  start_time: string;
  end_time: string;
  gmeet_link: string;
  topic: string | null;
  status: string | null;
  created_at: string;
}

export interface LectureVisit {
  id: string;
  lecture_id: string | null;
  profile_id: string | null;
  clicked_at: string | null;
  attended: boolean | null;
}
