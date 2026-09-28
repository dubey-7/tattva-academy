"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isSameDay, parseISO } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Profile } from "@/types/profile";
import { Enrollment } from "@/types/enrollment";
import { StudentLectureRow } from "@/lib/lectures";
import { getAttendanceState } from "@/lib/attendance";

interface Props {
  profile: Profile | null;
  enrollments: Enrollment[];
  lectures: StudentLectureRow[];
}

const feeStatusColor: Record<string, string> = {
  paid: "bg-green-100 text-green-700 hover:bg-green-100",
  partial: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  unpaid: "bg-red-100 text-red-700 hover:bg-red-100",
};

const attendanceColor: Record<string, string> = {
  attended: "bg-green-100 text-green-700 hover:bg-green-100",
  absent: "bg-red-100 text-red-700 hover:bg-red-100",
  upcoming: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  live: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  cancelled: "bg-muted text-muted-foreground",
};

export default function DashboardClient({
  profile,
  enrollments,
  lectures,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const lectureDates = useMemo(
    () => lectures.map((l) => parseISO(l.lecture_date)),
    [lectures]
  );

  const upcoming = useMemo(() => {
    return lectures
      .filter((l) => {
        const state = getAttendanceState(l, l.visit);
        return state === "upcoming" || state === "live";
      })
      .sort(
        (a, b) =>
          new Date(`${a.lecture_date}T${a.start_time}`).getTime() -
          new Date(`${b.lecture_date}T${b.start_time}`).getTime()
      );
  }, [lectures]);

  const nextLecture = upcoming[0];

  const pastLectures = useMemo(
    () =>
      lectures
        .filter((l) => {
          const state = getAttendanceState(l, l.visit);
          return state === "attended" || state === "absent";
        })
        .sort(
          (a, b) =>
            new Date(`${b.lecture_date}T${b.start_time}`).getTime() -
            new Date(`${a.lecture_date}T${a.start_time}`).getTime()
        ),
    [lectures]
  );

  const lecturesOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return lectures.filter((l) =>
      isSameDay(parseISO(l.lecture_date), selectedDate)
    );
  }, [lectures, selectedDate]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          Welcome
          {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your courses, lectures, and attendance in one place.
        </p>
      </div>

      {nextLecture ? (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-primary">
                Next Lecture
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {nextLecture.enrollment?.course?.subject ?? "Lecture"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {format(parseISO(nextLecture.lecture_date), "EEEE, MMM d")}{" "}
                · {nextLecture.start_time} - {nextLecture.end_time}
              </p>
              {nextLecture.topic && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Topic: {nextLecture.topic}
                </p>
              )}
            </div>

            <Button asChild size="lg">
              <Link href={`/join/${nextLecture.id}`}>Join Lecture</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="p-6 text-muted-foreground">
            No upcoming lectures scheduled yet.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses & Fees</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="history">Lecture History</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          {enrollments.length === 0 ? (
            <p className="text-muted-foreground">
              No enrollments yet. Once you&apos;ve discussed a course over
              WhatsApp, it will appear here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {enrollments.map((e) => (
                <Card key={e.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      {e.course?.subject}
                      <Badge className={feeStatusColor[e.fee_status]}>
                        {e.fee_status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>Curriculum: {e.course?.curriculum}</p>
                    {e.duration_weeks && (
                      <p>Duration: {e.duration_weeks} weeks</p>
                    )}
                    {e.fee_amount != null && <p>Fee: ₹{e.fee_amount}</p>}
                    {e.start_date && (
                      <p>
                        Started:{" "}
                        {format(parseISO(e.start_date), "MMM d, yyyy")}
                      </p>
                    )}
                    <p className="pt-1">
                      Status:{" "}
                      <span className="font-medium text-foreground">
                        {e.status}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <Card className="w-fit">
              <CardContent className="p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ hasLecture: lectureDates }}
                  modifiersClassNames={{
                    hasLecture:
                      "bg-primary/15 font-semibold text-primary rounded-md",
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMM d, yyyy")
                    : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lecturesOnSelectedDate.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No lectures on this date.
                  </p>
                ) : (
                  lecturesOnSelectedDate.map((l) => {
                    const state = getAttendanceState(l, l.visit);
                    return (
                      <div
                        key={l.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {l.enrollment?.course?.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {l.start_time} - {l.end_time}
                            {l.topic ? ` · ${l.topic}` : ""}
                          </p>
                        </div>
                        <Badge className={attendanceColor[state]}>
                          {state}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {pastLectures.length === 0 ? (
            <p className="text-muted-foreground">No past lectures yet.</p>
          ) : (
            <div className="space-y-2">
              {pastLectures.map((l) => {
                const state = getAttendanceState(l, l.visit);
                return (
                  <div
                    key={l.id}
                    className="flex flex-col justify-between gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {l.enrollment?.course?.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(l.lecture_date), "MMM d, yyyy")} ·{" "}
                        {l.start_time} - {l.end_time}
                        {l.topic ? ` · ${l.topic}` : ""}
                      </p>
                    </div>
                    <Badge className={attendanceColor[state]}>{state}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
