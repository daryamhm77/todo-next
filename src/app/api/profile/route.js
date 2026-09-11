import { NextResponse } from "next/server";
import User from "@/models/User";
import { hashPassword, verifyPassword } from "@/utils/auth";
import { publicProfile } from "@/utils/profile";
import { getCurrentUserDoc } from "@/utils/user";

export async function GET() {
  try {
    const { user, error } = await getCurrentUserDoc();
    if (error) return error;

    return NextResponse.json(
      { status: "success", data: publicProfile(user) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { user, error } = await getCurrentUserDoc();
    if (error) return error;

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : user.name || "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : user.lastName || "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : user.email;
    const currentPassword = body.password || body.currentPassword || "";
    const newPassword = body.newPassword || "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 422 }
      );
    }

    const emailChanged = email !== user.email.toLowerCase();
    const passwordChanged = Boolean(newPassword);

    if (emailChanged || passwordChanged) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Enter your current password to change email or password" },
          { status: 422 }
        );
      }
      const isValid = await verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 422 });
      }
    }

    if (passwordChanged && newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 422 }
      );
    }

    if (emailChanged) {
      const taken = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (taken) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 422 }
        );
      }
      user.email = email;
    }

    user.name = name;
    user.lastName = lastName;
    if (passwordChanged) {
      user.password = await hashPassword(newPassword);
    }
    await user.save();

    return NextResponse.json(
      { status: "success", data: publicProfile(user) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
