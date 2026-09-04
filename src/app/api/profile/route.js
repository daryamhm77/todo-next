import { verifyPassword } from "@/utils/auth";

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
    const { name, lastName, password } = req.json();
    const isValid = await verifyPassword(password, user.password);
    if(!isValid){
        return NextResponse.json(
            {error: "Incorrect Password❌"},
            {status : 422}
        );
    }
    user.name = name;
    user.lastName = lastName;
    user.save();
    return NextResponse.json(
        { data: { name: user.name, lastName: user.lastName, email: user.email }},
        {status: 200}
    );

    } catch (error) {
         return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
    }
}