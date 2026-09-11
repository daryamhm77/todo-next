"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import Loader from "@/module/Loader";
import PasswordField from "@/module/PasswordField";

function AuthModal() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInUser = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      toast.error(
        res.error === "CredentialsSignin"
          ? "Incorrect email or password"
          : res.error
      );
      return false;
    }
    toast.success("Signed in");
    router.refresh();
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter a valid email and password");
      return;
    }

    if (mode === "signup") {
      if (password !== rePassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    if (mode === "signup") {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.status !== 201) {
        setLoading(false);
        toast.error(data.error || "Could not create account");
        return;
      }
      toast.success("Account created");
    }

    await signInUser();
    setLoading(false);
  };

  return (
    <div className="auth-overlay">
      <form className="auth-modal" onSubmit={submitHandler}>
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "signin" ? "is-active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "is-active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>
        <h2>{mode === "signin" ? "Sign in" : "Create account"}</h2>
        <div className="fields">
          <div className="field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "signup" ? (
            <PasswordField
              id="rePassword"
              label="Repeat password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
          ) : null}
        </div>
        {loading ? (
          <Loader />
        ) : (
          <button className="btn" type="submit">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        )}
      </form>
    </div>
  );
}

export default AuthModal;
