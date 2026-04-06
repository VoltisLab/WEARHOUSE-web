"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { STAFF_TOKEN_KEY, USER_TOKEN_KEY } from "@/lib/auth-tokens";

type AuthContextValue = {
  staffToken: string | null;
  userToken: string | null;
  ready: boolean;
  setStaffToken: (t: string | null) => void;
  setUserToken: (t: string | null) => void;
  logoutStaff: () => void;
  logoutUser: () => void;
  /** Clears both sessions. */
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [staffToken, setStaffTokenState] = useState<string | null>(null);
  const [userToken, setUserTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStaffTokenState(localStorage.getItem(STAFF_TOKEN_KEY));
    setUserTokenState(localStorage.getItem(USER_TOKEN_KEY));
    setReady(true);
  }, []);

  const setStaffToken = useCallback((t: string | null) => {
    setStaffTokenState(t);
    if (t) localStorage.setItem(STAFF_TOKEN_KEY, t);
    else localStorage.removeItem(STAFF_TOKEN_KEY);
  }, []);

  const setUserToken = useCallback((t: string | null) => {
    setUserTokenState(t);
    if (t) localStorage.setItem(USER_TOKEN_KEY, t);
    else localStorage.removeItem(USER_TOKEN_KEY);
  }, []);

  const logoutStaff = useCallback(() => {
    setStaffToken(null);
  }, [setStaffToken]);

  const logoutUser = useCallback(() => {
    setUserToken(null);
  }, [setUserToken]);

  const logout = useCallback(() => {
    setStaffToken(null);
    setUserToken(null);
  }, [setStaffToken, setUserToken]);

  const value = useMemo(
    () => ({
      staffToken,
      userToken,
      ready,
      setStaffToken,
      setUserToken,
      logoutStaff,
      logoutUser,
      logout,
    }),
    [
      staffToken,
      userToken,
      ready,
      setStaffToken,
      setUserToken,
      logoutStaff,
      logoutUser,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
