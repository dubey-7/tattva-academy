import { Lecture, LectureVisit, AttendanceState } from "@/types/lecture";

function getLectureWindow(lecture: Lecture) {
  const [sh, sm] = lecture.start_time.split(":").map(Number);
  const [eh, em] = lecture.end_time.split(":").map(Number);

  const start = new Date(lecture.lecture_date);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(lecture.lecture_date);
  end.setHours(eh, em, 0, 0);

  return { start, end };
}

/**
 * Computes attendance state on the fly - no background job required.
 * - If the student clicked the join link during the lecture window -> "attended"
 * - If the lecture window has passed and they never clicked -> "absent"
 * - Otherwise "upcoming" / "live" / "cancelled"
 */
export function getAttendanceState(
  lecture: Lecture,
  visit: LectureVisit | null | undefined
): AttendanceState {
  if (lecture.status === "cancelled") return "cancelled";

  if (visit?.attended) return "attended";

  const { start, end } = getLectureWindow(lecture);
  const now = new Date();

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";

  return "absent";
}

/**
 * The join link only redirects to the real Gmeet link within this window
 * (10 min before start, through the scheduled end time).
 */
export function isWithinJoinWindow(lecture: Lecture): boolean {
  const { start, end } = getLectureWindow(lecture);

  const openFrom = new Date(start);
  openFrom.setMinutes(openFrom.getMinutes() - 10);

  const now = new Date();

  return now >= openFrom && now <= end;
}
