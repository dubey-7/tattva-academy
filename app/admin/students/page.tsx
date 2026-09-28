import { getAllProfiles } from "@/lib/profiles";
import { getCourses } from "@/lib/courses";
import { getAllEnrollments } from "@/lib/enrollments";

import StudentsClient from "./StudentsClient";

export default async function AdminStudentsPage() {
  const [profiles, courses, enrollments] = await Promise.all([
    getAllProfiles(),
    getCourses(),
    getAllEnrollments(),
  ]);

  return (
    <StudentsClient
      profiles={profiles}
      courses={courses}
      enrollments={enrollments}
    />
  );
}
