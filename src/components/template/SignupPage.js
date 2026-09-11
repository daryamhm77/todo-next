"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import Loader from "@/module/Loader";
import PasswordField from "@/module/PasswordField";

function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signupHandler = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.status !== 201) {
      setLoading(false);
      toast.error(data.error || "Could not create account");
      return;
    }
    toast.success("Account created");
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <form className="auth-wrap" onSubmit={signupHandler}>
      <h2>Sign up</h2>
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
        <PasswordField
          id="rePassword"
          label="Repeat password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <button className="btn" type="submit">
          Create account
        </button>
      )}
    </form>
  );
}

export default SignupPage;
