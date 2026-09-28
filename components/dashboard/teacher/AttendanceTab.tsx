"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

import {
  EmptyState,
  Field,
  NativeSelect,
  Panel,
  StatusBadge,
} from "../DashboardUI";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatLectureDate, formatLectureTime } from "@/lib/academy";

import { enrollmentLabel, studentName, type TeacherData } from "./types";

export default function AttendanceTab({ data }: { data: TeacherData }) {
  const [supabase] = useState(() => createClient());
  const [lectureId, setLectureId] = useState("");

  const lectures = useMemo(
    () => data.lectures.filter((l) => l.status !== "cancelled"),
    [data.lectures]
  );

  const selected =
    lectures.find((l) => l.id === lectureId) ?? lectures[0] ?? null;

  const enrollment = data.enrollments.find(
    (e) => e.id === selected?.enrollment_id
  );

  const visit = data.visits.find(
    (v) => v.lecture_id === selected?.id && v.profile_id === enrollment?.profile_id
  );

  async function mark(attended: boolean) {
    if (!selected || !enrollment?.profile_id) return;

    const query = visit
      ? supabase.from("lecture_visits").update({ attended }).eq("id", visit.id)
      : supabase.from("lecture_visits").insert({
          lecture_id: selected.id,
          profile_id: enrollment.profile_id,
          attended,
        });

    const { error } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(attended ? "Marked present." : "Marked absent.");
    data.reload();
  }

  /* Attendance summary per enrollment */
  const summary = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return data.enrollments
      .map((e) => {
        const held = data.lectures.filter(
          (l) =>
            l.enrollment_id === e.id &&
            l.status !== "cancelled" &&
            l.lecture_date <= today
        );

        const present = held.filter((l) =>
          data.visits.some(
            (v) =>
              v.lecture_id === l.id &&
              v.profile_id === e.profile_id &&
              v.attended
          )
        ).length;

        return { enrollment: e, held: held.length, present };
      })
      .filter((row) => row.held > 0);
  }, [data]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <Panel
        title="Mark attendance"
        description="Pick a lecture, then mark whether the student attended."
      >
        {lectures.length ? (
          <div className="space-y-5">
            <Field label="Lecture">
              <NativeSelect
                value={selected?.id ?? ""}
                onChange={(e) => setLectureId(e.target.value)}
              >
                {lectures.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lecture_date} · {enrollmentLabel(data, l.enrollment_id)}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            {selected && (
              <div className="rounded-2xl border p-4">
                <p className="font-semibold">
                  {studentName(data, enrollment?.profile_id ?? null)}
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatLectureDate(selected)} · {formatLectureTime(selected)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Status:</span>

                  <StatusBadge
                    status={
                      visit?.attended
                        ? "present"
                        : visit && visit.attended === false && !visit.clicked_at
                        ? "absent"
                        : visit?.clicked_at
                        ? "joined (unconfirmed)"
                        : "not marked"
                    }
                  />

                  {visit?.clicked_at && (
                    <span className="text-xs text-muted-foreground">
                      clicked Join at{" "}
                      {new Date(visit.clicked_at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    className="h-10 flex-1 rounded-xl"
                    onClick={() => mark(true)}
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    Present
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 flex-1 rounded-xl"
                    onClick={() => mark(false)}
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Absent
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState title="No lectures to mark yet" />
        )}
      </Panel>

      <Panel title="Attendance summary">
        {summary.length ? (
          <ul className="divide-y">
            {summary.map(({ enrollment, held, present }) => {
              const pct = Math.round((present / held) * 100);

              return (
                <li key={enrollment.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate font-medium">
                      {enrollmentLabel(data, enrollment.id)}
                    </p>

                    <span className="shrink-0 text-sm font-semibold">
                      {present}/{held} · {pct}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title="Summary appears once lectures have taken place" />
        )}
      </Panel>
    </div>
  );
}
