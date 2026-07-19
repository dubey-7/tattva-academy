import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      parent_name,
      student_name,
      whatsapp,
      email,
      country,
      grade,
      subject,
      curriculum,
    } = body;

    if (
      !parent_name?.trim() ||
      !student_name?.trim() ||
      !whatsapp?.trim() ||
      !email?.trim() ||
      !country?.trim() ||
      !grade?.trim() ||
      !subject?.trim() ||
      !curriculum?.trim()
    ) {
      return NextResponse.json(
        {
          message: "Please fill all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabaseAdmin
      .from("trial_registrations")
      .insert({
        parent_name: parent_name.trim(),
        student_name: student_name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        country: country.trim(),
        grade: grade.trim(),
        subject: subject.trim(),
        curriculum: curriculum.trim(),
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}