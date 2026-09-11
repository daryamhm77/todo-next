"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import Loader from "@/module/Loader";
import PasswordField from "@/module/PasswordField";

function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signinHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res.error) {
      toast.error(
        res.error === "CredentialsSignin"
          ? "Incorrect email or password"
          : res.error
      );
      return;
    }
    toast.success("Signed in");
    router.push("/");
    router.refresh();
  };

  return (
    <form className="auth-wrap" onSubmit={signinHandler}>
      <h2>Sign in</h2>
      <div className="fields">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <button className="btn" type="submit">
          Sign in
        </button>
      )}
    </form>
  );
}

export default SigninPage;
