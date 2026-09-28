import type { Metadata } from "next";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export const metadata: Metadata = {
  title: "My Dashboard | Tattva",
};

export default function DashboardPage() {
  return <StudentDashboard />;
}
