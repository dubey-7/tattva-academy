import { NextResponse } from "next/server";

import { createCourse } from "@/lib/courses";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { subject, curriculum, description } = body;

    if (!subject?.trim() || !curriculum?.trim()) {
      return NextResponse.json(
        { message: "Subject and curriculum are required." },
        { status: 400 }
      );
    }

    const { data, error } = await createCourse({
      subject: subject.trim(),
      curriculum: curriculum.trim(),
      description: description?.trim() || undefined,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, course: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
