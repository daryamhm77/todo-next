import { cache } from "react";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { getSession } from "@/utils/session";
import { publicProfile, todoBoard } from "@/utils/profile";

function sessionEmail(session) {
  return session?.user?.email?.trim().toLowerCase() || "";
}

const getCurrentUser = cache(async () => {
  const session = await getSession();
  const email = sessionEmail(session);
  if (!email) return null;

  await connectDB();
  return User.findOne({ email }).select("-password").lean();
});

async function getCurrentUserDoc() {
  const session = await getSession();
  const email = sessionEmail(session);
  if (!email) return { error: NextResponse.json({ error: "Please log in" }, { status: 401 }) };

  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  }

  return { user };
}

async function getTodoBoard() {
  const user = await getCurrentUser();
  return todoBoard(user);
}

async function getProfileData() {
  const user = await getCurrentUser();
  if (!user) return null;
  return publicProfile(user);
}

export { getCurrentUser, getCurrentUserDoc, getTodoBoard, getProfileData };
