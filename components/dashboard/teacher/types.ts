import type {
  Course,
  Enrollment,
  Lecture,
  LectureVisit,
  Profile,
} from "@/types/academy";

export interface TeacherData {
  students: Profile[];
  courses: Course[];
  enrollments: Enrollment[];
  lectures: Lecture[];
  visits: LectureVisit[];
  reload: () => void;
}

export function studentName(data: TeacherData, profileId: string | null) {
  return (
    data.students.find((s) => s.id === profileId)?.full_name ?? "Unknown student"
  );
}

export function courseLabel(data: TeacherData, courseId: string | null) {
  const c = data.courses.find((x) => x.id === courseId);

  return c ? `${c.subject} · ${c.curriculum}` : "Course";
}

export function enrollmentLabel(data: TeacherData, enrollmentId: string | null) {
  const e = data.enrollments.find((x) => x.id === enrollmentId);

  if (!e) return "Unknown enrollment";

  return `${studentName(data, e.profile_id)} — ${courseLabel(data, e.course_id)}`;
}
