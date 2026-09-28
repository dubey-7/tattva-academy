"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Enrollment } from "@/types/enrollment";
import { getAttendanceState } from "@/lib/attendance";
import { AdminLectureRow } from "@/lib/lectures";

const attendanceColor: Record<string, string> = {
  attended: "bg-green-100 text-green-700 hover:bg-green-100",
  absent: "bg-red-100 text-red-700 hover:bg-red-100",
  upcoming: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  live: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  cancelled: "bg-muted text-muted-foreground",
};

export default function LecturesClient({
  enrollments,
  lectures,
}: {
  enrollments: Enrollment[];
  lectures: AdminLectureRow[];
}) {
  const [form, setForm] = useState({
    enrollment_id: "",
    lecture_date: "",
    start_time: "",
    end_time: "",
    gmeet_link: "",
    topic: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (
      !form.enrollment_id ||
      !form.lecture_date ||
      !form.start_time ||
      !form.end_time ||
      !form.gmeet_link.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/lectures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message || "Failed to schedule lecture.");
      return;
    }

    toast.success("Lecture scheduled.");
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule Lecture</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Student & Course</Label>
            <Select
              value={form.enrollment_id}
              onValueChange={(v) =>
                setForm({ ...form, enrollment_id: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select enrollment" />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.profile?.full_name} · {e.course?.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={form.lecture_date}
              onChange={(e) =>
                setForm({ ...form, lecture_date: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={form.start_time}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={form.end_time}
                onChange={(e) =>
                  setForm({ ...form, end_time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label>Google Meet Link</Label>
            <Input
              value={form.gmeet_link}
              onChange={(e) =>
                setForm({ ...form, gmeet_link: e.target.value })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Topic</Label>
            <Input
              value={form.topic}
              onChange={(e) =>
                setForm({ ...form, topic: e.target.value })
              }
            />
          </div>

          <Button
            onClick={submit}
            disabled={loading}
            className="w-fit sm:col-span-2"
          >
            {loading ? "Scheduling..." : "Schedule Lecture"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Lectures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lectures.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No lectures scheduled yet.
            </p>
          )}
          {lectures.map((l) => {
            const visit = l.visits?.[0] ?? null;
            const state = getAttendanceState(l, visit);
            return (
              <div
                key={l.id}
                className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-medium">
                    {l.enrollment?.profile?.full_name} ·{" "}
                    {l.enrollment?.course?.subject}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(l.lecture_date), "MMM d, yyyy")} ·{" "}
                    {l.start_time} - {l.end_time}
                    {l.topic ? ` · ${l.topic}` : ""}
                  </p>
                </div>
                <Badge className={attendanceColor[state]}>{state}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
