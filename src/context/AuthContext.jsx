import { createContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const STORAGE_KEY = "jobnative.auth";

const AuthContext = createContext(null);

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);

    if (!parsedSession?.refreshToken) {
      return null;
    }

    return parsedSession;
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function bootstrapSession() {
      const storedSession = readStoredSession();

      if (!storedSession) {
        if (isActive) {
          setSession(null);
          setIsReady(true);
        }
        return;
      }

      try {
        if (!storedSession.accessToken) {
          throw new Error("Missing access token.");
        }

        const user = await authService.me(storedSession.accessToken);

        if (isActive) {
          const nextSession = { ...storedSession, user };
          setSession(nextSession);
          writeStoredSession(nextSession);
        }
      } catch {
        try {
          const refreshedSession = await authService.refresh(
            storedSession.refreshToken,
          );

          if (isActive) {
            setSession(refreshedSession);
            writeStoredSession(refreshedSession);
          }
        } catch {
          if (isActive) {
            setSession(null);
            writeStoredSession(null);
          }
        }
      } finally {
        if (isActive) {
          setIsReady(true);
        }
      }
    }

    bootstrapSession();

    return () => {
      isActive = false;
    };
  }, []);

  async function login(credentials) {
    const nextSession = await authService.login(credentials);
    setSession(nextSession);
    writeStoredSession(nextSession);
    return nextSession;
  }

  async function signup(payload) {
    const nextSession = await authService.register(payload);
    setSession(nextSession);
    writeStoredSession(nextSession);
    return nextSession;
  }

  async function logout() {
    const refreshToken = session?.refreshToken;

    setSession(null);
    writeStoredSession(null);

    if (!refreshToken) {
      return;
    }

    try {
      await authService.logout(refreshToken);
    } catch (error) {
      console.warn("Unable to revoke refresh token during logout.", error);
    }
  }

  async function refreshSession() {
    if (!session?.refreshToken) {
      throw new Error("No refresh token available.");
    }

    const nextSession = await authService.refresh(session.refreshToken);
    setSession(nextSession);
    writeStoredSession(nextSession);
    return nextSession;
  }

  const value = {
    accessToken: session?.accessToken ?? null,
    isAuthenticated: Boolean(session?.user && session?.accessToken),
    isReady,
    login,
    logout,
    refreshSession,
    refreshToken: session?.refreshToken ?? null,
    signup,
    user: session?.user ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
