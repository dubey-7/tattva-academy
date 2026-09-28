"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, ExternalLink, Trash2 } from "lucide-react";

import {
  EmptyState,
  Field,
  NativeSelect,
  Panel,
  StatusBadge,
  controlClass,
} from "../DashboardUI";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  LECTURE_STATUSES,
  addDays,
  formatLectureDate,
  formatLectureTime,
} from "@/lib/academy";

import { enrollmentLabel, type TeacherData } from "./types";

const emptyForm = {
  enrollment_id: "",
  lecture_date: "",
  start_time: "",
  end_time: "",
  gmeet_link: "",
  topic: "",
  repeat_weeks: "1",
};

export default function ScheduleTab({ data }: { data: TeacherData }) {
  const [supabase] = useState(() => createClient());
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  const schedulable = data.enrollments.filter(
    (e) => e.status === "active" || e.status === "pending"
  );

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function createLectures() {
    const weeks = Math.max(1, Math.min(52, Number(form.repeat_weeks) || 1));

    if (
      !form.enrollment_id ||
      !form.lecture_date ||
      !form.start_time ||
      !form.end_time ||
      !form.gmeet_link.trim()
    ) {
      toast.error("Please fill in student, date, times and meeting link.");
      return;
    }

    if (form.end_time <= form.start_time) {
      toast.error("End time must be after start time.");
      return;
    }

    if (!/^https:\/\//i.test(form.gmeet_link.trim())) {
      toast.error("Meeting link must start with https://");
      return;
    }

    setSaving(true);

    const rows = Array.from({ length: weeks }, (_, i) => ({
      enrollment_id: form.enrollment_id,
      lecture_date: addDays(form.lecture_date, i * 7),
      start_time: form.start_time,
      end_time: form.end_time,
      gmeet_link: form.gmeet_link.trim(),
      topic: form.topic.trim() || null,
      status: "scheduled",
    }));

    const { error } = await supabase.from("lectures").insert(rows);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      weeks > 1 ? `${weeks} weekly lectures scheduled.` : "Lecture scheduled."
    );

    setForm({ ...emptyForm, enrollment_id: form.enrollment_id });
    data.reload();
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("lectures")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    data.reload();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this lecture? Attendance records for it will be affected."))
      return;

    const { error } = await supabase.from("lectures").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Lecture deleted.");
    data.reload();
  }

  const today = new Date().toISOString().slice(0, 10);

  const list = useMemo(() => {
    const sorted = [...data.lectures].sort((a, b) =>
      `${a.lecture_date}${a.start_time}`.localeCompare(
        `${b.lecture_date}${b.start_time}`
      )
    );

    if (filter === "upcoming")
      return sorted.filter((l) => l.lecture_date >= today);

    if (filter === "past")
      return sorted.filter((l) => l.lecture_date < today).reverse();

    return sorted;
  }, [data.lectures, filter, today]);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <Panel
        title="Schedule a lecture"
        description="Times are in IST. Students see them in their own timezone."
      >
        <div className="space-y-4">
          <Field label="Student & course">
            <NativeSelect
              value={form.enrollment_id}
              onChange={set("enrollment_id")}
            >
              <option value="">Select…</option>

              {schedulable.map((e) => (
                <option key={e.id} value={e.id}>
                  {enrollmentLabel(data, e.id)}
                </option>
              ))}
            </NativeSelect>
          </Field>

          {!schedulable.length && (
            <p className="text-xs text-muted-foreground">
              No active enrollments yet — create one in the Enrollments tab.
            </p>
          )}

          <Field label="Date">
            <input
              type="date"
              className={controlClass}
              value={form.lecture_date}
              onChange={set("lecture_date")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start (IST)">
              <input
                type="time"
                className={controlClass}
                value={form.start_time}
                onChange={set("start_time")}
              />
            </Field>

            <Field label="End (IST)">
              <input
                type="time"
                className={controlClass}
                value={form.end_time}
                onChange={set("end_time")}
              />
            </Field>
          </div>

          <Field label="Google Meet link">
            <input
              className={controlClass}
              placeholder="https://meet.google.com/…"
              value={form.gmeet_link}
              onChange={set("gmeet_link")}
            />
          </Field>

          <Field label="Topic (optional)">
            <input
              className={controlClass}
              value={form.topic}
              onChange={set("topic")}
            />
          </Field>

          <Field label="Repeat weekly for (weeks)">
            <input
              type="number"
              min={1}
              max={52}
              className={controlClass}
              value={form.repeat_weeks}
              onChange={set("repeat_weeks")}
            />
          </Field>

          <Button
            onClick={createLectures}
            disabled={saving}
            className="h-11 w-full rounded-xl"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            {saving ? "Scheduling…" : "Schedule"}
          </Button>
        </div>
      </Panel>

      <Panel
        title="Lectures"
        action={
          <NativeSelect
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="h-9 w-auto"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </NativeSelect>
        }
      >
        {list.length ? (
          <ul className="divide-y">
            {list.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {enrollmentLabel(data, l.enrollment_id)}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatLectureDate(l)} · {formatLectureTime(l)}
                    {l.topic ? ` · ${l.topic}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />

                  <NativeSelect
                    value={l.status ?? "scheduled"}
                    onChange={(e) => updateStatus(l.id, e.target.value)}
                    className="h-9 w-auto"
                  >
                    {LECTURE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </NativeSelect>

                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-lg"
                  >
                    <a
                      href={l.gmeet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open meeting"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-lg text-destructive"
                    onClick={() => remove(l.id)}
                    aria-label="Delete lecture"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No lectures here yet" />
        )}
      </Panel>
    </div>
  );
}
