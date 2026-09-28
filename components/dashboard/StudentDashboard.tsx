"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  ExternalLink,
  Video,
  Wallet,
} from "lucide-react";

import {
  DashboardShell,
  EmptyState,
  Field,
  LoginRequired,
  PageLoader,
  Panel,
  StatCard,
  StatusBadge,
  controlClass,
} from "./DashboardUI";

import { Button } from "@/components/ui/button";
import { useAcademyUser } from "@/hooks/useAcademyUser";
import { useNow } from "@/hooks/useNow";
import { createClient } from "@/lib/supabase/client";
import {
  formatLectureDate,
  formatLectureTime,
  joinState,
  lectureStart,
  timeUntil,
  viewerTimeZone,
  JOIN_EARLY_MINUTES,
} from "@/lib/academy";

import type {
  EnrollmentWithCourse,
  Lecture,
  LectureVisit,
} from "@/types/academy";

interface Data {
  uid: string;
  enrollments: EnrollmentWithCourse[];
  lectures: Lecture[];
  visits: LectureVisit[];
}

export default function StudentDashboard() {
  const router = useRouter();
  const now = useNow();

  const { user, profile, loading, isTeacher, refreshProfile } =
    useAcademyUser();

  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<Data | null>(null);
  const [tick, setTick] = useState(0);

  const uid = user?.id;

  /* Teachers have their own panel */
  useEffect(() => {
    if (isTeacher) router.replace("/teacher");
  }, [isTeacher, router]);

  /* Load enrollments → lectures → visits */
  useEffect(() => {
    if (!uid) return;

    let cancelled = false;

    (async () => {
      const { data: enr, error } = await supabase
        .from("enrollments")
        .select("*, courses(*)")
        .eq("profile_id", uid)
        .order("created_at", { ascending: false });

      if (error) toast.error("Could not load your courses.");

      const enrollments = (enr ?? []) as unknown as EnrollmentWithCourse[];
      const ids = enrollments.map((e) => e.id);

      let lectures: Lecture[] = [];

      if (ids.length) {
        const { data: lec } = await supabase
          .from("lectures")
          .select("*")
          .in("enrollment_id", ids)
          .order("lecture_date", { ascending: true })
          .order("start_time", { ascending: true });

        lectures = (lec ?? []) as Lecture[];
      }

      const { data: vis } = await supabase
        .from("lecture_visits")
        .select("*")
        .eq("profile_id", uid);

      if (!cancelled) {
        setData({
          uid,
          enrollments,
          lectures,
          visits: (vis ?? []) as LectureVisit[],
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, uid, tick]);

  const current = data && data.uid === uid ? data : null;

  const visitMap = useMemo(() => {
    const map = new Map<string, LectureVisit>();
    current?.visits.forEach((v) => v.lecture_id && map.set(v.lecture_id, v));
    return map;
  }, [current]);

  const courseName = useMemo(() => {
    const map = new Map<string, string>();

    current?.enrollments.forEach((e) =>
      map.set(
        e.id,
        e.courses
          ? `${e.courses.subject} · ${e.courses.curriculum}`
          : "Course"
      )
    );

    return map;
  }, [current]);

  if (loading) return <PageLoader />;

  if (!user)
    return (
      <LoginRequired message="Log in to see your courses, join live lectures and track your attendance." />
    );

  if (isTeacher) return <PageLoader label="Opening teacher panel…" />;

  if (!current) return <PageLoader label="Loading your dashboard…" />;

  const { enrollments, lectures } = current;

  const active = lectures.filter((l) => l.status !== "cancelled");
  const upcoming = active.filter((l) => joinState(l, now) !== "ended");
  const past = active
    .filter((l) => joinState(l, now) === "ended")
    .reverse();

  const attendedCount = past.filter((l) => visitMap.get(l.id)?.attended).length;
  const attendancePct = past.length
    ? Math.round((attendedCount / past.length) * 100)
    : null;

  const pendingFee = enrollments
    .filter((e) => e.status !== "cancelled" && e.fee_status !== "paid")
    .reduce((sum, e) => sum + (e.fee_amount ?? 0), 0);

  const next = upcoming[0];

  async function joinLecture(lecture: Lecture) {
    window.open(lecture.gmeet_link, "_blank", "noopener,noreferrer");

    if (!uid || visitMap.has(lecture.id)) return;

    const { error } = await supabase.from("lecture_visits").insert({
      lecture_id: lecture.id,
      profile_id: uid,
      clicked_at: new Date().toISOString(),
      attended: false,
    });

    if (!error) setTick((t) => t + 1);
  }

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || "Student";

  return (
    <DashboardShell
      title={`Welcome, ${displayName.split(" ")[0]} 👋`}
      subtitle="Your classes, lectures and progress at a glance."
      actions={
        <Button asChild variant="outline" className="h-11 rounded-xl px-5">
          <Link href="/courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Courses
          </Link>
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Active courses"
          value={enrollments.filter((e) => e.status === "active").length}
        />

        <StatCard
          icon={<CalendarClock className="h-5 w-5" />}
          label="Upcoming lectures"
          value={upcoming.length}
        />

        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Attendance"
          value={attendancePct === null ? "—" : `${attendancePct}%`}
          hint={
            past.length
              ? `${attendedCount} of ${past.length} lectures`
              : "No completed lectures yet"
          }
        />

        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Fees pending"
          value={pendingFee > 0 ? pendingFee.toLocaleString() : "Nil"}
        />
      </div>

      {/* Next lecture */}
      <Panel title="Next lecture">
        {next ? (
          <NextLecture
            lecture={next}
            course={courseName.get(next.enrollment_id ?? "") ?? "Course"}
            now={now}
            onJoin={() => joinLecture(next)}
          />
        ) : (
          <EmptyState
            title="No lectures scheduled yet"
            text={
              enrollments.length
                ? "Your teacher will schedule your lectures soon. They will appear here with a one-click Join button."
                : "Enrol in a course and your lectures will appear here."
            }
          />
        )}
      </Panel>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          {/* Upcoming */}
          <Panel
            title="Upcoming lectures"
            description={`Times shown in your local time${
              viewerTimeZone() ? ` (${viewerTimeZone()})` : ""
            }.`}
          >
            {upcoming.length ? (
              <ul className="divide-y">
                {upcoming.map((l) => (
                  <LectureRow
                    key={l.id}
                    lecture={l}
                    course={courseName.get(l.enrollment_id ?? "") ?? "Course"}
                    now={now}
                    onJoin={() => joinLecture(l)}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState title="Nothing coming up" />
            )}
          </Panel>

          {/* History */}
          <Panel title="Lecture history">
            {past.length ? (
              <ul className="divide-y">
                {past.map((l) => {
                  const attended = visitMap.get(l.id)?.attended;

                  return (
                    <li
                      key={l.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <div>
                        <p className="font-medium">
                          {l.topic || courseName.get(l.enrollment_id ?? "")}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {formatLectureDate(l)} · {formatLectureTime(l)}
                        </p>
                      </div>

                      <StatusBadge status={attended ? "present" : "absent"} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState title="No completed lectures yet" />
            )}
          </Panel>
        </div>

        <div className="space-y-8">
          {/* Courses */}
          <Panel title="My courses">
            {enrollments.length ? (
              <ul className="space-y-3">
                {enrollments.map((e) => (
                  <li key={e.id} className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {e.courses?.subject ?? "Course"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {e.courses?.curriculum}
                        </p>
                      </div>

                      <StatusBadge status={e.status} />
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      {e.start_date && (
                        <>
                          <dt className="text-muted-foreground">Starts</dt>
                          <dd>{e.start_date}</dd>
                        </>
                      )}

                      {e.duration_weeks && (
                        <>
                          <dt className="text-muted-foreground">Duration</dt>
                          <dd>{e.duration_weeks} weeks</dd>
                        </>
                      )}

                      <dt className="text-muted-foreground">Fees</dt>
                      <dd className="flex items-center gap-2">
                        {e.fee_amount != null && (
                          <span>{e.fee_amount.toLocaleString()}</span>
                        )}
                        <StatusBadge status={e.fee_status} />
                      </dd>
                    </dl>

                    {e.status === "pending" && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Awaiting confirmation from your teacher.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="You haven't enrolled yet"
                action={
                  <Button asChild className="rounded-xl">
                    <Link href="/courses">View courses</Link>
                  </Button>
                }
              />
            )}
          </Panel>

          <ProfileCard
            key={profile?.id ?? "no-profile"}
            email={user.email ?? ""}
            profile={profile}
            userId={user.id}
            onSaved={refreshProfile}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */

function NextLecture({
  lecture,
  course,
  now,
  onJoin,
}: {
  lecture: Lecture;
  course: string;
  now: number;
  onJoin: () => void;
}) {
  const state = joinState(lecture, now);

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-primary">{course}</p>

        <h3 className="mt-1 text-xl font-bold sm:text-2xl">
          {lecture.topic || "Live lecture"}
        </h3>

        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" />
            {formatLectureDate(lecture)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatLectureTime(lecture)}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <Button
          size="lg"
          disabled={state !== "open"}
          onClick={onJoin}
          className="h-12 rounded-xl px-8 text-base font-semibold"
        >
          <Video className="mr-2 h-5 w-5" />
          {state === "open" ? "Join Class" : "Join opens soon"}
        </Button>

        <p className="text-center text-xs text-muted-foreground sm:text-right">
          {state === "open"
            ? "Class is open — click to join Google Meet"
            : `Starts in ${timeUntil(lectureStart(lecture), now)} · joining opens ${JOIN_EARLY_MINUTES} min before`}
        </p>
      </div>
    </div>
  );
}

function LectureRow({
  lecture,
  course,
  now,
  onJoin,
}: {
  lecture: Lecture;
  course: string;
  now: number;
  onJoin: () => void;
}) {
  const state = joinState(lecture, now);

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium">{lecture.topic || course}</p>

        <p className="text-sm text-muted-foreground">
          {formatLectureDate(lecture)} · {formatLectureTime(lecture)}
        </p>
      </div>

      <Button
        size="sm"
        variant={state === "open" ? "default" : "outline"}
        disabled={state !== "open"}
        onClick={onJoin}
        className="h-9 rounded-lg px-4"
      >
        <ExternalLink className="mr-1.5 h-4 w-4" />
        {state === "open" ? "Join" : `In ${timeUntil(lectureStart(lecture), now)}`}
      </Button>
    </li>
  );
}

/* ------------------------------------------------------------------ */

function ProfileCard({
  email,
  profile,
  userId,
  onSaved,
}: {
  email: string;
  profile: ReturnType<typeof useAcademyUser>["profile"];
  userId: string;
  onSaved: () => void;
}) {
  const [supabase] = useState(() => createClient());
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    grade: profile?.grade ?? "",
    country: profile?.country ?? "",
    curriculum: profile?.curriculum ?? "",
  });

  async function save() {
    if (!form.full_name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        grade: form.grade.trim() || null,
        country: form.country.trim() || null,
        curriculum: form.curriculum.trim() || null,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      toast.error("Could not save your profile.");
      return;
    }

    toast.success("Profile updated.");
    onSaved();
  }

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Panel title="My profile">
      <div className="space-y-4">
        <Field label="Email">
          <input className={controlClass} value={email} disabled readOnly />
        </Field>

        <Field label="Full name">
          <input
            className={controlClass}
            value={form.full_name}
            onChange={set("full_name")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <input
              className={controlClass}
              value={form.phone}
              onChange={set("phone")}
            />
          </Field>

          <Field label="Grade">
            <input
              className={controlClass}
              value={form.grade}
              onChange={set("grade")}
            />
          </Field>

          <Field label="Country">
            <input
              className={controlClass}
              value={form.country}
              onChange={set("country")}
            />
          </Field>

          <Field label="Curriculum">
            <input
              className={controlClass}
              value={form.curriculum}
              onChange={set("curriculum")}
              placeholder="IB, IGCSE, CBSE…"
            />
          </Field>
        </div>

        <Button
          onClick={save}
          disabled={saving || !profile}
          className="h-11 w-full rounded-xl"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>

        {!profile && (
          <p className="text-xs text-muted-foreground">
            Your profile record isn&apos;t available yet. Please contact your
            teacher if this persists.
          </p>
        )}
      </div>
    </Panel>
  );
}
