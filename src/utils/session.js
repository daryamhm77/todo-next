import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const getSession = cache(async () => getServerSession(authOptions));

export { getSession };
