import { NextResponse } from "next/server";

import { createEnrollment, updateEnrollment } from "@/lib/enrollments";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      profile_id,
      course_id,
      fee_amount,
      duration_weeks,
      start_date,
      notes,
    } = body;

    if (!profile_id || !course_id) {
      return NextResponse.json(
        { message: "Student and course are required." },
        { status: 400 }
      );
    }

    const { data, error } = await createEnrollment({
      profile_id,
      course_id,
      fee_amount: fee_amount ? Number(fee_amount) : undefined,
      duration_weeks: duration_weeks
        ? Number(duration_weeks)
        : undefined,
      start_date: start_date || undefined,
      notes: notes?.trim() || undefined,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, enrollment: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Enrollment id is required." },
        { status: 400 }
      );
    }

    const { error } = await updateEnrollment(id, patch);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
