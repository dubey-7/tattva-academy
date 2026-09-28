"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarPlus,
  ClipboardCheck,
  GraduationCap,
  MessageSquareText,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DashboardShell,
  LoginRequired,
  PageLoader,
  StatCard,
} from "./DashboardUI";

import ScheduleTab from "./teacher/ScheduleTab";
import AttendanceTab from "./teacher/AttendanceTab";
import EnrollmentsTab from "./teacher/EnrollmentsTab";
import CoursesTab from "./teacher/CoursesTab";
import TrialsTab from "./teacher/TrialsTab";
import ReviewsTab from "./teacher/ReviewsTab";
import type { TeacherData } from "./teacher/types";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useAcademyUser } from "@/hooks/useAcademyUser";
import { createClient } from "@/lib/supabase/client";
import { isTeacherRole } from "@/lib/academy";

import type {
  Course,
  Enrollment,
  Lecture,
  LectureVisit,
  Profile,
} from "@/types/academy";

type Loaded = Omit<TeacherData, "reload">;

const triggerClass =
  "flex-none gap-2 px-4 data-[state=active]:bg-background";

export default function TeacherDashboard() {
  const { user, profile, loading, isTeacher } = useAcademyUser();

  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<Loaded | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isTeacher) return;

    let cancelled = false;

    (async () => {
      const [p, c, e, l, v] = await Promise.all([
        supabase.from("profiles").select("*").order("full_name"),
        supabase.from("courses").select("*").order("subject"),
        supabase
          .from("enrollments")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("lectures")
          .select("*")
          .order("lecture_date", { ascending: false })
          .order("start_time", { ascending: false }),
        supabase.from("lecture_visits").select("*"),
      ]);

      if (cancelled) return;

      setData({
        students: ((p.data ?? []) as Profile[]).filter(
          (x) => !isTeacherRole(x.role)
        ),
        courses: (c.data ?? []) as Course[],
        enrollments: (e.data ?? []) as Enrollment[],
        lectures: (l.data ?? []) as Lecture[],
        visits: (v.data ?? []) as LectureVisit[],
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, isTeacher, tick]);

  if (loading) return <PageLoader />;

  if (!user)
    return <LoginRequired message="Log in with your teacher account to manage classes." />;

  if (!isTeacher)
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border bg-card p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold">Teacher access only</h2>

          <p className="mt-2 text-muted-foreground">
            This area is for teachers. Your account is set up as a student.
          </p>

          <Button asChild className="mt-6 h-11 rounded-xl px-6">
            <Link href="/dashboard">Go to my dashboard</Link>
          </Button>
        </div>
      </div>
    );

  if (!data) return <PageLoader label="Loading teacher panel…" />;

  const teacherData: TeacherData = {
    ...data,
    reload: () => setTick((t) => t + 1),
  };

  const activeEnrollments = data.enrollments.filter(
    (e) => e.status === "active"
  ).length;

  const pendingEnrollments = data.enrollments.filter(
    (e) => e.status === "pending"
  ).length;

  const today = new Date().toISOString().slice(0, 10);
  const upcomingCount = data.lectures.filter(
    (l) => l.status !== "cancelled" && l.lecture_date >= today
  ).length;

  return (
    <DashboardShell
      title={`Teacher panel${profile?.full_name ? ` · ${profile.full_name}` : ""}`}
      subtitle="Schedule lectures, track attendance and manage your students."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Students"
          value={data.students.length}
        />

        <StatCard
          icon={<GraduationCap className="h-5 w-5" />}
          label="Active enrollments"
          value={activeEnrollments}
        />

        <StatCard
          icon={<UserPlus className="h-5 w-5" />}
          label="Awaiting approval"
          value={pendingEnrollments}
        />

        <StatCard
          icon={<CalendarPlus className="h-5 w-5" />}
          label="Upcoming lectures"
          value={upcomingCount}
        />
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto p-1.5">
          <TabsTrigger value="schedule" className={triggerClass}>
            <CalendarPlus className="h-4 w-4" />
            Schedule
          </TabsTrigger>

          <TabsTrigger value="attendance" className={triggerClass}>
            <ClipboardCheck className="h-4 w-4" />
            Attendance
          </TabsTrigger>

          <TabsTrigger value="enrollments" className={triggerClass}>
            <GraduationCap className="h-4 w-4" />
            Enrollments
          </TabsTrigger>

          <TabsTrigger value="courses" className={triggerClass}>
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>

          <TabsTrigger value="trials" className={triggerClass}>
            <UserPlus className="h-4 w-4" />
            Trial requests
          </TabsTrigger>

          <TabsTrigger value="reviews" className={triggerClass}>
            <MessageSquareText className="h-4 w-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <ScheduleTab data={teacherData} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab data={teacherData} />
        </TabsContent>

        <TabsContent value="enrollments">
          <EnrollmentsTab data={teacherData} />
        </TabsContent>

        <TabsContent value="courses">
          <CoursesTab data={teacherData} />
        </TabsContent>

        <TabsContent value="trials">
          <TrialsTab />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
