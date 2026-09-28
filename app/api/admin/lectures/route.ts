import { NextResponse } from "next/server";

import { createLecture } from "@/lib/lectures";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      enrollment_id,
      lecture_date,
      start_time,
      end_time,
      gmeet_link,
      topic,
    } = body;

    if (
      !enrollment_id ||
      !lecture_date ||
      !start_time ||
      !end_time ||
      !gmeet_link?.trim()
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const { data, error } = await createLecture({
      enrollment_id,
      lecture_date,
      start_time,
      end_time,
      gmeet_link: gmeet_link.trim(),
      topic: topic?.trim() || undefined,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lecture: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
