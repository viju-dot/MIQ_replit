/* =========================================================================
 * Fiber Workspace — Login (/login)
 *
 * Prototype auth gate: a single centered Fiber-styled card. Exactly one
 * credential is accepted (see auth.ts). On success we set the sessionStorage
 * flag and redirect to "/". Client-side only — there is no backend.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Focus/hover color changes use React state. Layout / spacing /
 * typography-size classes stay as utilities.
 * ========================================================================= */

import { useState } from "react";
import { useLocation } from "wouter";
import { WarningCircle } from "@phosphor-icons/react";
import { login } from "./auth";

// Token-driven colors (var(--token, fallbackHex)) — flip with [data-theme].
const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  inputBorder: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  inputBorderFocus: "var(--border-dynamic-brand-default,#7c33b5)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  errorBorder: "var(--border-dynamic-error-default,#da294b)",
  errorBg: "var(--container-dynamic-error-subtle-background-selected,#ffedef)",
  errorFg: "var(--container-dynamic-error-subtle-foreground-default,#da294b)",
  brandBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBgHover: "var(--container-dynamic-brand-bold-background-hover,#702ea3)",
  brandFg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
};

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
  const [focused, setFocused] = useState(false);
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-[var(--spacing-75,6px)]">
      <span
        className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
        style={{ color: C.textPrimary }}
      >
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[36px] w-full rounded-[2px] border border-solid px-[var(--spacing-150,12px)] text-[length:var(--body-md-regular-size,14px)] transition-colors duration-150 outline-none"
        style={{
          backgroundColor: C.surface,
          borderColor: focused ? C.inputBorderFocus : C.inputBorder,
          color: C.textPrimary,
        }}
      />
    </label>
  );
}

export default function LoginPage(): JSX.Element {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

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
      className="flex min-h-screen items-center justify-center px-[var(--spacing-200,16px)] py-[var(--spacing-500,40px)]"
      style={{ backgroundColor: C.canvasBg, fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      <div
        className="flex w-full max-w-[400px] flex-col gap-[var(--spacing-400,32px)] rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-500,40px)] py-[var(--spacing-500,40px)]"
        style={{
          backgroundColor: C.surface,
          borderColor: C.border,
          boxShadow: "var(--elevation-regular)",
        }}
      >
        {/* Brand / title */}
        <div className="flex flex-col items-center gap-[var(--spacing-150,12px)] text-center">
          <img
            src={`${import.meta.env.BASE_URL}figmaAssets/miq-lettermark.svg`}
            alt="MIQ"
            className="block w-auto"
            style={{ height: 44 }}
          />

          <div className="flex flex-col gap-[var(--spacing-25,2px)]">
            <h1
              className="text-[length:var(--headline-sm-semibold-size,20px)] font-semibold tracking-[-0.4px]"
              style={{ color: C.textPrimary }}
            >
              Fiber Workspace
            </h1>
            <p
              className="text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: C.textMuted }}
            >
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
              className="flex items-center gap-[var(--spacing-100,8px)] rounded-[2px] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
              style={{ backgroundColor: C.errorBg, borderColor: C.errorBorder }}
              role="alert"
            >
              <WarningCircle
                size={16}
                weight="fill"
                color="var(--surface-foreground-static-error,#da294b)"
              />
              <span
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: C.errorFg }}
              >
                Incorrect username or password.
              </span>
            </div>
          )}

          {/* Primary Fill button */}
          <button
            type="submit"
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            className="mt-[var(--spacing-50,4px)] flex h-[36px] w-full items-center justify-center rounded-[2px] text-[length:var(--body-md-medium-size,14px)] font-medium transition-colors"
            style={{
              backgroundColor: submitHover ? C.brandBgHover : C.brandBg,
              color: C.brandFg,
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
