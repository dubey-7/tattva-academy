export type LectureStatus = "scheduled" | "completed" | "cancelled";

export interface Lecture {
  id: string;

  enrollment_id: string;

  lecture_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS

  gmeet_link: string;
  topic: string | null;

  status: LectureStatus;

  created_at: string;
}

export interface LectureVisit {
  id: string;

  lecture_id: string;
  profile_id: string;

  clicked_at: string | null;
  attended: boolean;
}

export type AttendanceState =
  | "upcoming"
  | "live"
  | "attended"
  | "absent"
  | "cancelled";
