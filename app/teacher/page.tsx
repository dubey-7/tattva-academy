import type { Metadata } from "next";

import TeacherDashboard from "@/components/dashboard/TeacherDashboard";

export const metadata: Metadata = {
  title: "Teacher Panel | Tattva",
};

export default function TeacherPage() {
  return <TeacherDashboard />;
}
