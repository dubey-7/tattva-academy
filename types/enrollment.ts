import { Course } from "./course";
import { Profile } from "./profile";

export type FeeStatus = "unpaid" | "partial" | "paid";

export type EnrollmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Enrollment {
  id: string;

  profile_id: string;
  course_id: string;

  fee_amount: number | null;
  fee_status: FeeStatus;

  duration_weeks: number | null;
  start_date: string | null;

  status: EnrollmentStatus;
  notes: string | null;

  created_at: string;

  course?: Course;
  profile?: Profile;
}
