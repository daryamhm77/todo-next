import { NextResponse } from "next/server";
import { getCurrentUserDoc } from "@/utils/user";
import { serializeTodos } from "@/utils/todos";

export async function POST(req) {
  try {
    const { user, error } = await getCurrentUserDoc();
    if (error) return error;

    const { title, status = "todo", who = "", dueDate = "", priority = "medium" } =
      await req.json();

    if (!title) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    user.todos.push({ title, status, who, dueDate, priority });
    await user.save();

    return NextResponse.json(
      {
        status: "success",
        message: "Todo created",
        data: { todos: serializeTodos(user.todos) },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { user, error } = await getCurrentUserDoc();
    if (error) return error;

    return NextResponse.json(
      {
        status: "success",
        data: { todos: serializeTodos(user.todos), notes: user.notes || "" },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { user, error } = await getCurrentUserDoc();
    if (error) return error;

    const body = await req.json();

    if (typeof body.notes === "string" && !body.id) {
      user.notes = body.notes;
      await user.save();
      return NextResponse.json(
        { status: "success", data: { notes: user.notes } },
        { status: 200 }
      );
    }

    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const todo = user.todos.id(id);
    if (!todo) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    todo.status = status;
    await user.save();

    return NextResponse.json(
      { status: "success", message: "Todo updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
