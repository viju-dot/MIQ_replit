/* =========================================================================
 * Fiber Workspace — client-side auth helper (PROTOTYPE GATE)
 *
 * This is an intentionally lightweight, client-only auth gate for a prototype.
 * There is exactly one hard-coded credential and the "session" is a single
 * sessionStorage flag. There is NO backend — do not treat this as real auth.
 * ========================================================================= */

import { useSyncExternalStore } from "react";

const AUTH_KEY = "fiber.auth";

/* Reactive store: components using useAuth() re-render together when the
 * session flag changes, so redirect logic never sees inconsistent state. */
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reactive hook — preferred inside components over isAuthenticated(). */
export function useAuth(): boolean {
  return useSyncExternalStore(subscribe, isAuthenticated, () => false);
}

// The single prototype credential.
const USERNAME = "vijay";
const PASSWORD = "ChallengeACompetions";

export const CURRENT_USER = USERNAME;

export function isAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

/** Validate credentials and, on success, persist the session flag. */
export function login(username: string, password: string): boolean {
  if (username === USERNAME && password === PASSWORD) {
    try {
      sessionStorage.setItem(AUTH_KEY, "1");
    } catch {
      /* ignore storage failures in prototype */
    }
    notify();
    return true;
  }
  return false;
}

export function logout(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
  notify();
}
