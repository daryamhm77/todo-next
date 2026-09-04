import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { sortTodos } from "@/utils/sortTodos";
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
        await connectDB();
        const session = await getServerSession(req);
        if (!session) {
            return NextResponse.json(
        {
          error: "Please Log in",
        },
        { status: 401 }
      );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
     return NextResponse.json(
        { error: "User Not Found❌" },
        { status: 404 }
      );
  }
   const { title, status } = req.json();

    if (!title || !status) {
       return NextResponse.json(
        { error: "Invalid Data❌" },
        { status: 400 }
      );
    }

    user.todos.push({ title, status });
    user.save();

     return NextResponse.json(
      { message: "Todo Created👍" },
      { status: 201 }
    );
    } catch (error) {
         return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
    }
}

export async function GET(req) {
    try {
         await connectDB();
        const session = await getServerSession(req);
        if (!session) {
            return NextResponse.json(
        {
          error: "Please Log in",
        },
        { status: 401 }
      );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
     return NextResponse.json(
        { error: "User Not Found❌" },
        { status: 404 }
      );
  }
  const sortedData = sortTodos(user.todos);
   return NextResponse.json(
      {
         data: { todos: sortedData },
      },
      { status: 200 }
    );
    } catch (error) {
         return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
    }
}
export async function PATCH(req) {
    try {
         await connectDB();
        const session = await getServerSession(req);
        if (!session) {
            return NextResponse.json(
        {
          error: "Please Log in",
        },
        { status: 401 }
      );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
     return NextResponse.json(
        { error: "User Not Found❌" },
        { status: 404 }
      );
  }
  const { id, status } = req.json();

    if (!id || !status) {
     return NextResponse.json(
        { error: "Invalid Data❌" },
        { status: 400 }
      );
    }

    const result = await User.updateOne(
      { "todos._id": id },
      { $set: { "todos.$.status": status } }
    );
    console.log(result);
    return NextResponse.json(
      { message: "Todo Updated👍" },
      { status: 200 })
    } catch (error) {
         return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
    }
}