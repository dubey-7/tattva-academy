"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import {
  EmptyState,
  Field,
  NativeSelect,
  Panel,
  controlClass,
} from "../DashboardUI";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ENROLLMENT_STATUSES, FEE_STATUSES } from "@/lib/academy";

import { courseLabel, studentName, type TeacherData } from "./types";

const emptyForm = {
  profile_id: "",
  course_id: "",
  fee_amount: "",
  duration_weeks: "",
  start_date: "",
  status: "active",
  fee_status: "unpaid",
  notes: "",
};

export default function EnrollmentsTab({ data }: { data: TeacherData }) {
  const [supabase] = useState(() => createClient());
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function create() {
    if (!form.profile_id || !form.course_id) {
      toast.error("Choose a student and a course.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("enrollments").insert({
      profile_id: form.profile_id,
      course_id: form.course_id,
      fee_amount: form.fee_amount ? Number(form.fee_amount) : null,
      duration_weeks: form.duration_weeks ? Number(form.duration_weeks) : null,
      start_date: form.start_date || null,
      status: form.status,
      fee_status: form.fee_status,
      notes: form.notes.trim() || null,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Enrollment created.");
    setForm(emptyForm);
    data.reload();
  }

  async function update(id: string, patch: Record<string, string>) {
    const { error } = await supabase
      .from("enrollments")
      .update(patch)
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    data.reload();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <Panel title="New enrollment">
        <div className="space-y-4">
          <Field label="Student">
            <NativeSelect value={form.profile_id} onChange={set("profile_id")}>
              <option value="">Select…</option>

              {data.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                  {s.grade ? ` (Grade ${s.grade})` : ""}
                </option>
              ))}
            </NativeSelect>
          </Field>

          <Field label="Course">
            <NativeSelect value={form.course_id} onChange={set("course_id")}>
              <option value="">Select…</option>

              {data.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subject} · {c.curriculum}
                </option>
              ))}
            </NativeSelect>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fee amount">
              <input
                type="number"
                min={0}
                className={controlClass}
                value={form.fee_amount}
                onChange={set("fee_amount")}
              />
            </Field>

            <Field label="Duration (weeks)">
              <input
                type="number"
                min={1}
                className={controlClass}
                value={form.duration_weeks}
                onChange={set("duration_weeks")}
              />
            </Field>
          </div>

          <Field label="Start date">
            <input
              type="date"
              className={controlClass}
              value={form.start_date}
              onChange={set("start_date")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <NativeSelect value={form.status} onChange={set("status")}>
                {ENROLLMENT_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </NativeSelect>
            </Field>

            <Field label="Fee status">
              <NativeSelect value={form.fee_status} onChange={set("fee_status")}>
                {FEE_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>

          <Field label="Notes (optional)">
            <input
              className={controlClass}
              value={form.notes}
              onChange={set("notes")}
            />
          </Field>

          <Button
            onClick={create}
            disabled={saving}
            className="h-11 w-full rounded-xl"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Create enrollment"}
          </Button>
        </div>
      </Panel>

      <Panel
        title="Enrollments"
        description="Student requests appear here as “pending” — set them to active to approve."
      >
        {data.enrollments.length ? (
          <ul className="divide-y">
            {data.enrollments.map((e) => (
              <li key={e.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {studentName(data, e.profile_id)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {courseLabel(data, e.course_id)}
                      {e.start_date ? ` · starts ${e.start_date}` : ""}
                      {e.duration_weeks ? ` · ${e.duration_weeks} wks` : ""}
                      {e.fee_amount != null
                        ? ` · fee ${e.fee_amount.toLocaleString()}`
                        : ""}
                    </p>

                    {e.notes && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {e.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <NativeSelect
                      value={e.status ?? "pending"}
                      onChange={(ev) => update(e.id, { status: ev.target.value })}
                      className="h-9 w-auto"
                      aria-label="Enrollment status"
                    >
                      {ENROLLMENT_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </NativeSelect>

                    <NativeSelect
                      value={e.fee_status ?? "unpaid"}
                      onChange={(ev) =>
                        update(e.id, { fee_status: ev.target.value })
                      }
                      className="h-9 w-auto"
                      aria-label="Fee status"
                    >
                      {FEE_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </NativeSelect>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No enrollments yet" />
        )}
      </Panel>
    </div>
  );
}
