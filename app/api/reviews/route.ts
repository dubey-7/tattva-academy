import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      rating,
      review,
      country,
    } = body;

    if (
      !name?.trim() ||
      !review?.trim() ||
      !rating || !country
    ) {
      return NextResponse.json(
        {
          message: "Please fill all fields.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .insert({
        name: name.trim(),
        review: review.trim(),
        rating,
        status: "pending",
        is_featured: false,
        display_order: null,
        country: country || null,
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