import type { Lecture } from "@/types/academy";

/**
 * Lecture date/time columns are plain `date` / `time` values with no timezone.
 * They are treated as India Standard Time (the teacher's timezone; IST has no DST)
 * and converted to each viewer's local time for display.
 */
export const LECTURE_TZ_OFFSET = "+05:30";

/** Students may join from this many minutes before the start time. */
export const JOIN_EARLY_MINUTES = 15;

export const ENROLLMENT_STATUSES = [
  "pending",
  "active",
  "completed",
  "cancelled",
] as const;

export const FEE_STATUSES = ["unpaid", "partial", "paid"] as const;

export const LECTURE_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
] as const;

function normaliseTime(time: string) {
  return time.length === 5 ? `${time}:00` : time.slice(0, 8);
}

export function lectureStart(lecture: Pick<Lecture, "lecture_date" | "start_time">) {
  return new Date(
    `${lecture.lecture_date}T${normaliseTime(lecture.start_time)}${LECTURE_TZ_OFFSET}`
  );
}

export function lectureEnd(lecture: Pick<Lecture, "lecture_date" | "end_time">) {
  return new Date(
    `${lecture.lecture_date}T${normaliseTime(lecture.end_time)}${LECTURE_TZ_OFFSET}`
  );
}

export type JoinState = "upcoming" | "open" | "ended" | "cancelled";

export function joinState(lecture: Lecture, now: number): JoinState {
  if (lecture.status === "cancelled") return "cancelled";

  const start = lectureStart(lecture).getTime();
  const end = lectureEnd(lecture).getTime();

  if (now > end) return "ended";
  if (now >= start - JOIN_EARLY_MINUTES * 60_000) return "open";

  return "upcoming";
}

export function formatLectureDate(lecture: Lecture) {
  return lectureStart(lecture).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatLectureTime(lecture: Lecture) {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  return `${lectureStart(lecture).toLocaleTimeString(undefined, opts)} – ${lectureEnd(
    lecture
  ).toLocaleTimeString(undefined, opts)}`;
}

export function viewerTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

export function timeUntil(target: Date, now: number) {
  const diff = target.getTime() - now;

  if (diff <= 0) return "now";

  const minutes = Math.floor(diff / 60_000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;

  return `${mins}m`;
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);

  return d.toISOString().slice(0, 10);
}

export function isTeacherRole(role: string | null | undefined) {
  return role === "teacher" || role === "admin";
}
