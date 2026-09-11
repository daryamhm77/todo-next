import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { hashPassword } from "@/utils/auth";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter a valid email and password" },
        { status: 422 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 422 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 422 }
      );
    }

    await User.create({
      email,
      password: await hashPassword(password),
    });

    return NextResponse.json(
      { status: "success", message: "Account created" },
      { status: 201 }
    );
  } catch (err) {
    const details = err?.message || "";
    console.error("Signup failed:", details);
    const error = /mongo|database/i.test(details)
      ? "Could not connect to the database. Check MONGODB_URI."
      : "Could not create account. Please try again";
    return NextResponse.json({ error }, { status: 500 });
  }
}
