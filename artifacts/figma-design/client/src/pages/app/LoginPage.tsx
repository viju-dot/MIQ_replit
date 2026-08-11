/* =========================================================================
 * Fiber Workspace — Login (/login)
 *
 * Prototype auth gate: a single centered Fiber-styled card. Exactly one
 * credential is accepted (see auth.ts). On success we set the sessionStorage
 * flag and redirect to "/". Client-side only — there is no backend.
 * ========================================================================= */

import { useState } from "react";
import { useLocation } from "wouter";
import { Sparkle, WarningCircle } from "@phosphor-icons/react";
import { login } from "./auth";

// Token-driven palette (var(--token, fallbackHex)) — flips with [data-theme].
const surface = "bg-[var(--surface-background-lvl1,#ffffff)]";
const canvasBg = "bg-[var(--surface-background-lvl2,#f7f7fa)]";
const borderToken = "border-[var(--border-static-subtle-neutral,#e1e1e8)]";
const inputBorder = "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]";
const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textMuted = "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]";

function Field({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-[var(--spacing-75,6px)]">
      <span
        className={`text-[length:var(--body-sm-medium-size,12px)] font-medium ${textPrimary}`}
      >
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[36px] w-full rounded-[2px] border border-solid px-[var(--spacing-150,12px)] text-[length:var(--body-md-regular-size,14px)] transition-colors duration-150 outline-none ${inputBorder} ${surface} ${textPrimary} placeholder:text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] focus:border-[var(--border-dynamic-brand-default,#7c33b5)]`}
      />
    </label>
  );
}

export default function LoginPage(): JSX.Element {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError(false);
      navigate("/");
    } else {
      setError(true);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-[var(--spacing-200,16px)] py-[var(--spacing-500,40px)] ${canvasBg}`}
      style={{ fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      <div
        className={`flex w-full max-w-[400px] flex-col gap-[var(--spacing-400,32px)] rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-500,40px)] py-[var(--spacing-500,40px)] shadow-[var(--elevation-regular)] ${borderToken} ${surface}`}
      >
        {/* Brand / title */}
        <div className="flex flex-col items-center gap-[var(--spacing-150,12px)] text-center">
          <div className="flex size-[48px] items-center justify-center rounded-[var(--radius-100,8px)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]">
            <Sparkle
              size={26}
              weight="fill"
              color="var(--container-dynamic-brand-bold-foreground-default,#ffffff)"
            />
          </div>
          <div className="flex flex-col gap-[var(--spacing-25,2px)]">
            <h1
              className={`text-[length:var(--headline-sm-semibold-size,20px)] font-semibold tracking-[-0.4px] ${textPrimary}`}
            >
              Fiber Workspace
            </h1>
            <p className={`text-[length:var(--body-md-regular-size,14px)] ${textMuted}`}>
              Sign in to continue
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-[var(--spacing-200,16px)]" onSubmit={onSubmit}>
          <Field
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(v) => {
              setUsername(v);
              setError(false);
            }}
            autoComplete="username"
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setError(false);
            }}
            autoComplete="current-password"
          />

          {/* Fiber-style inline error state */}
          {error && (
            <div
              className="flex items-center gap-[var(--spacing-100,8px)] rounded-[2px] border border-solid border-[var(--border-dynamic-error-default,#da294b)] bg-[var(--container-dynamic-error-subtle-background-selected,#ffedef)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
              role="alert"
            >
              <WarningCircle
                size={16}
                weight="fill"
                color="var(--surface-foreground-static-error,#da294b)"
              />
              <span className="text-[length:var(--body-sm-regular-size,12px)] text-[var(--container-dynamic-error-subtle-foreground-default,#da294b)]">
                Incorrect username or password.
              </span>
            </div>
          )}

          {/* Primary Fill button */}
          <button
            type="submit"
            className="mt-[var(--spacing-50,4px)] flex h-[36px] w-full items-center justify-center rounded-[2px] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] text-[length:var(--body-md-medium-size,14px)] font-medium text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)] transition-colors hover:bg-[var(--container-dynamic-brand-bold-background-hover,#702ea3)]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
