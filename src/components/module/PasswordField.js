"use client";

import { useState } from "react";

function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-field">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={
            autoComplete ||
            (id === "password" || id === "currentPassword"
              ? "current-password"
              : "new-password")
          }
        />
        <button type="button" onClick={() => setVisible((current) => !current)}>
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;
