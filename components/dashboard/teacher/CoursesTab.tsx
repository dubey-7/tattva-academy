"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import {
  EmptyState,
  Field,
  Panel,
  controlClass,
} from "../DashboardUI";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import type { TeacherData } from "./types";

export default function CoursesTab({ data }: { data: TeacherData }) {
  const [supabase] = useState(() => createClient());
  const [form, setForm] = useState({
    subject: "",
    curriculum: "",
    description: "",
  });

  async function add() {
    if (!form.subject.trim() || !form.curriculum.trim()) {
      toast.error("Subject and curriculum are required.");
      return;
    }

    const { error } = await supabase.from("courses").insert({
      subject: form.subject.trim(),
      curriculum: form.curriculum.trim(),
      description: form.description.trim() || null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Course added.");
    setForm({ subject: "", curriculum: "", description: "" });
    data.reload();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this course?")) return;

    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      toast.error(
        "Could not delete — students may already be enrolled in this course."
      );
      return;
    }

    toast.success("Course deleted.");
    data.reload();
  }

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <Panel title="Add a course" description="Shown on the public Courses page.">
        <div className="space-y-4">
          <Field label="Subject">
            <input
              className={controlClass}
              value={form.subject}
              onChange={set("subject")}
              placeholder="Mathematics"
            />
          </Field>

          <Field label="Curriculum">
            <input
              className={controlClass}
              value={form.curriculum}
              onChange={set("curriculum")}
              placeholder="IGCSE"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              className={`${controlClass} h-auto py-2`}
              value={form.description}
              onChange={set("description")}
            />
          </Field>

          <Button onClick={add} className="h-11 w-full rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add course
          </Button>
        </div>
      </Panel>

      <Panel title="Courses">
        {data.courses.length ? (
          <ul className="divide-y">
            {data.courses.map((c) => (
              <li
                key={c.id}
                className="flex items-start justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold">
                    {c.subject}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {c.curriculum}
                    </span>
                  </p>

                  {c.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0 rounded-lg text-destructive"
                  onClick={() => remove(c.id)}
                  aria-label="Delete course"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No courses yet" />
        )}
      </Panel>
    </div>
  );
}
