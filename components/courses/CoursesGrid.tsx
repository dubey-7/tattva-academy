"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, LogIn } from "lucide-react";

import SubjectCard from "@/components/cards/SubjectCard";
import AuthDialog from "@/components/auth/AuthDialog";
import { Button } from "@/components/ui/button";

import { useAcademyUser } from "@/hooks/useAcademyUser";
import { createClient } from "@/lib/supabase/client";
import { courses as staticCourses } from "@/data/courses";

import type { Course } from "@/types/academy";

/**
 * Shows the courses stored in Supabase (with "Request enrollment").
 * Until they load — or if the table is empty — the original static cards
 * are shown, so the page never looks empty.
 */
export default function CoursesGrid() {
  const { user, isTeacher } = useAcademyUser();

  const [supabase] = useState(() => createClient());
  const [dbCourses, setDbCourses] = useState<Course[] | null>(null);
  const [enrolled, setEnrolled] = useState<Record<string, string>>({});
  const [authOpen, setAuthOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const uid = user?.id;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .order("subject");

      if (!cancelled) setDbCourses((data ?? []) as Course[]);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("course_id, status")
        .eq("profile_id", uid);

      if (cancelled) return;

      const map: Record<string, string> = {};

      (data ?? []).forEach((e) => {
        if (e.course_id && e.status !== "cancelled")
          map[e.course_id] = e.status ?? "pending";
      });

      setEnrolled(map);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, uid, tick]);

  async function request(courseId: string) {
    if (!uid) {
      setAuthOpen(true);
      return;
    }

    setBusy(courseId);

    const { error } = await supabase.from("enrollments").insert({
      profile_id: uid,
      course_id: courseId,
      status: "pending",
      fee_status: "unpaid",
    });

    setBusy(null);

    if (error) {
      toast.error("Could not send your request. Please try again.");
      return;
    }

    toast.success("Enrollment requested! Your teacher will confirm shortly.");
    setTick((t) => t + 1);
  }

  function footerFor(course: Course) {
    if (isTeacher) return null;

    const status = uid ? enrolled[course.id] : undefined;

    if (status === "active" || status === "completed")
      return (
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          You&apos;re enrolled
        </p>
      );

    if (status === "pending")
      return (
        <p className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-300">
          <Clock className="h-4 w-4" />
          Request sent — awaiting confirmation
        </p>
      );

    return (
      <Button
        variant="outline"
        className="h-11 w-full rounded-xl"
        disabled={busy === course.id}
        onClick={() => request(course.id)}
      >
        {!uid && <LogIn className="mr-2 h-4 w-4" />}
        {busy === course.id
          ? "Sending…"
          : uid
          ? "Request Enrollment"
          : "Login to Enrol"}
      </Button>
    );
  }

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {dbCourses && dbCourses.length > 0
          ? dbCourses.map((course) => (
              <SubjectCard
                key={course.id}
                title={course.subject}
                badge={course.curriculum}
                description={course.description ?? ""}
                footer={footerFor(course)}
              />
            ))
          : staticCourses.map((course) => (
              <SubjectCard
                key={course.id}
                title={course.title}
                description={course.description}
              />
            ))}
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
