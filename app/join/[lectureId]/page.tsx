import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isWithinJoinWindow } from "@/lib/attendance";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function JoinLecturePage({
  params,
}: {
  params: Promise<{ lectureId: string }>;
}) {
  const { lectureId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: lecture } = await supabaseAdmin
    .from("lectures")
    .select("*, enrollment:enrollments(profile_id)")
    .eq("id", lectureId)
    .maybeSingle();

  if (!lecture || lecture.enrollment?.profile_id !== user.id) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <Card className="p-8">
          <h1 className="text-xl font-bold">Lecture Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            This lecture link isn&apos;t associated with your account.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (lecture.status === "cancelled") {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <Card className="p-8">
          <h1 className="text-xl font-bold">Lecture Cancelled</h1>
          <p className="mt-2 text-muted-foreground">
            This lecture has been cancelled by your teacher.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!isWithinJoinWindow(lecture)) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <Card className="p-8">
          <h1 className="text-xl font-bold">Not Open Yet</h1>
          <p className="mt-2 text-muted-foreground">
            This link opens 10 minutes before your scheduled lecture on{" "}
            {lecture.lecture_date} at {lecture.start_time}.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Log attendance: clicking the link during the lecture window = present
  await supabaseAdmin.from("lecture_visits").upsert(
    {
      lecture_id: lectureId,
      profile_id: user.id,
      clicked_at: new Date().toISOString(),
      attended: true,
    },
    { onConflict: "lecture_id,profile_id" }
  );

  redirect(lecture.gmeet_link);
}
