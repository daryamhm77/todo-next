"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import PasswordField from "@/module/PasswordField";
import Loader from "@/module/Loader";
import { displayName } from "@/utils/names";

function ProfileForm({ initialData }) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialData?.name || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({
          name,
          lastName,
          email: email.trim(),
          password,
          newPassword,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const payload = await res.json();
      if (payload.status !== "success") {
        toast.error(payload.error || "Could not save profile");
        return;
      }

      setName(payload.data.name || "");
      setLastName(payload.data.lastName || "");
      setEmail(payload.data.email || "");
      setPassword("");
      setNewPassword("");
      await update({
        email: payload.data.email,
        name: displayName(payload.data),
      });
      toast.success("Profile saved");
      router.refresh();
    } catch (error) {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  if (saving) return <Loader />;

  return (
    <form className="fields" onSubmit={submitHandler}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div className="field">
          <label htmlFor="last-name">Last name</label>
          <input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <PasswordField
        id="currentPassword"
        label="Current password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <PasswordField
        id="newPassword"
        label="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
      />
      <p className="muted">
        Current password is required only when changing email or password.
      </p>
      <button className="btn" type="submit">
        Save
      </button>
    </form>
  );
}

export default ProfileForm;
