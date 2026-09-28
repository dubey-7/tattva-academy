import { getCourses } from "@/lib/courses";

import CoursesClient from "./CoursesClient";

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return <CoursesClient courses={courses} />;
}
