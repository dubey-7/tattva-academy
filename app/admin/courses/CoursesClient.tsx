"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Course } from "@/types/course";

export default function CoursesClient({ courses }: { courses: Course[] }) {
  const [form, setForm] = useState({
    subject: "",
    curriculum: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!form.subject.trim() || !form.curriculum.trim()) {
      toast.error("Subject and curriculum are required.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message || "Failed to add course.");
      return;
    }

    toast.success("Course added.");
    window.location.reload();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Curriculum</Label>
            <Input
              value={form.curriculum}
              onChange={(e) =>
                setForm({ ...form, curriculum: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Add Course"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {courses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No courses yet.
            </p>
          )}
          {courses.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-border p-3"
            >
              <p className="font-medium">{c.subject}</p>
              <p className="text-sm text-muted-foreground">
                {c.curriculum}
              </p>
              {c.description && (
                <p className="mt-1 text-sm">{c.description}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
