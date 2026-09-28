import { getAllEnrollments } from "@/lib/enrollments";
import { getAllLectures } from "@/lib/lectures";

import LecturesClient from "./LecturesClient";

export default async function AdminLecturesPage() {
  const [enrollments, lectures] = await Promise.all([
    getAllEnrollments(),
    getAllLectures(),
  ]);

  return (
    <LecturesClient enrollments={enrollments} lectures={lectures} />
  );
}
