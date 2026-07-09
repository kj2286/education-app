/**
 * localStorage utility functions for persisting auth state.
 *
 * All functions handle localStorage errors gracefully (e.g. private
 * browsing mode, storage quota exceeded, or SSR contexts where `window`
 * is unavailable) so callers can safely fall back to in-memory state.
 */

export const AUTH_STORAGE_KEY = "auth_user";

/**
 * A minimal structural type for what we persist. Kept intentionally
 * loose (not importing AuthUser) to avoid a circular dependency between
 * storage.ts and the context module; callers are expected to pass/receive
 * values shaped like AuthUser.
 */
export type StoredAuthUser = Record<string, unknown>;

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Reads and parses the persisted auth user from localStorage.
 * Returns null if unavailable, missing, or malformed.
 */
export function getAuthUser<T = StoredAuthUser>(): T | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn("[storage] Failed to read auth user from localStorage:", error);
    return null;
  }
}

/**
 * Serializes and persists the auth user to localStorage.
 * Silently no-ops (with a console warning) if storage is unavailable
 * or the write fails.
 */
export function setAuthUser<T = StoredAuthUser>(user: T): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn("[storage] Failed to persist auth user to localStorage:", error);
  }
}

/**
 * Removes the persisted auth user from localStorage.
 */
export function clearAuthUser(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.warn("[storage] Failed to clear auth user from localStorage:", error);
  }
}
