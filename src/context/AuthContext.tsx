"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { getAuthUser, setAuthUser, clearAuthUser } from "@/lib/storage";

export interface AuthUser {
  loggedIn: boolean;
  userType?: "teacher" | "student" | "parent";
  profile?: {
    name: string;
    schoolId: string;
    schoolName: string;
    grade: number;
    class: number;
  };
}

export interface AuthContextType {
  user: AuthUser;
  login: (email: string, password: string) => void;
  logout: () => void;
  selectUserType: (type: "teacher" | "student" | "parent") => void;
  saveProfile: (profile: Omit<AuthUser["profile"], never>) => void;
}

const DEFAULT_USER: AuthUser = {
  loggedIn: false,
};

type AuthAction =
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | { type: "SELECT_USER_TYPE"; payload: "teacher" | "student" | "parent" }
  | { type: "SAVE_PROFILE"; payload: NonNullable<AuthUser["profile"]> }
  | { type: "HYDRATE"; payload: AuthUser };

function authReducer(state: AuthUser, action: AuthAction): AuthUser {
  switch (action.type) {
    case "LOGIN":
      return { ...state, loggedIn: true };
    case "LOGOUT":
      return { ...DEFAULT_USER };
    case "SELECT_USER_TYPE":
      return { ...state, userType: action.payload };
    case "SAVE_PROFILE":
      return { ...state, profile: action.payload };
    case "HYDRATE":
      return { ...action.payload };
    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidStoredUser(value: unknown): value is AuthUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "loggedIn" in value &&
    typeof (value as { loggedIn: unknown }).loggedIn === "boolean"
  );
}

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, dispatch] = useReducer(authReducer, DEFAULT_USER);

  // Load persisted user from localStorage on mount. Guarded so that a
  // missing/corrupt/unavailable localStorage falls back to in-memory
  // default state instead of throwing.
  useEffect(() => {
    try {
      const stored = getAuthUser<AuthUser>();
      if (isValidStoredUser(stored)) {
        dispatch({ type: "HYDRATE", payload: stored });
      }
    } catch (error) {
      console.warn("[AuthProvider] Failed to hydrate auth state:", error);
    }
    // Intentionally run only once on mount.
  }, []);

  // Persist user to localStorage whenever it changes (after initial mount).
  useEffect(() => {
    try {
      if (user.loggedIn) {
        setAuthUser<AuthUser>(user);
      } else {
        clearAuthUser();
      }
    } catch (error) {
      console.warn("[AuthProvider] Failed to persist auth state:", error);
    }
  }, [user]);

  const login = useCallback((_email: string, _password: string) => {
    // Credential verification is expected to happen upstream (e.g. via an
    // auth helper/API call); this action simply marks the session as
    // logged in once the caller has validated credentials.
    void _email;
    void _password;
    dispatch({ type: "LOGIN" });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  const selectUserType = useCallback((type: "teacher" | "student" | "parent") => {
    dispatch({ type: "SELECT_USER_TYPE", payload: type });
  }, []);

  const saveProfile = useCallback((profile: Omit<AuthUser["profile"], never>) => {
    dispatch({ type: "SAVE_PROFILE", payload: profile as NonNullable<AuthUser["profile"]> });
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    selectUserType,
    saveProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
