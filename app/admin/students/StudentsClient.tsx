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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Profile } from "@/types/profile";
import { Course } from "@/types/course";
import { Enrollment } from "@/types/enrollment";

interface Props {
  profiles: Profile[];
  courses: Course[];
  enrollments: Enrollment[];
}

export default function StudentsClient({
  profiles,
  courses,
  enrollments,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    profile_id: "",
    course_id: "",
    fee_amount: "",
    duration_weeks: "",
    start_date: "",
    notes: "",
  });

  async function submitEnrollment() {
    if (!form.profile_id || !form.course_id) {
      toast.error("Select a student and a course.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message || "Failed to create enrollment.");
      return;
    }

    toast.success("Enrollment created.");
    setOpen(false);
    window.location.reload();
  }

  async function updateFeeStatus(id: string, fee_status: string) {
    const res = await fetch("/api/admin/enrollments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, fee_status }),
    });

    if (!res.ok) {
      toast.error("Failed to update fee status.");
      return;
    }

    toast.success("Fee status updated.");
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Students & Enrollments</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Enroll Student</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Enrollment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Student</Label>
                <Select
                  value={form.profile_id}
                  onValueChange={(v) =>
                    setForm({ ...form, profile_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name} · {p.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Course</Label>
                <Select
                  value={form.course_id}
                  onValueChange={(v) => setForm({ ...form, course_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.subject} ({c.curriculum})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fee (₹)</Label>
                  <Input
                    type="number"
                    value={form.fee_amount}
                    onChange={(e) =>
                      setForm({ ...form, fee_amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Duration (weeks)</Label>
                  <Input
                    type="number"
                    value={form.duration_weeks}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration_weeks: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Input
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={submitEnrollment} disabled={loading}>
                {loading ? "Saving..." : "Create Enrollment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.full_name}
                  </TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.grade}</TableCell>
                  <TableCell>{p.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Start</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.profile?.full_name}</TableCell>
                  <TableCell>{e.course?.subject}</TableCell>
                  <TableCell>
                    {e.fee_amount != null ? `₹${e.fee_amount}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={e.fee_status}
                      onValueChange={(v) => updateFeeStatus(e.id, v)}
                    >
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {e.duration_weeks ? `${e.duration_weeks}w` : "—"}
                  </TableCell>
                  <TableCell>
                    {e.start_date
                      ? format(new Date(e.start_date), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
