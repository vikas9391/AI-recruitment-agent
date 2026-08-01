import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { tokenStorage } from "../lib/apiClient";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type CurrentUser,
  type RegisterPayload,
} from "../lib/authApi";

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  register: (payload: RegisterPayload) => Promise<CurrentUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, if we already hold a token pair, hydrate the user
  // from /auth/me/ instead of forcing a fresh login every refresh.
  useEffect(() => {
    const accessToken = tokenStorage.getAccess();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user: loggedInUser, tokens } = await loginRequest(email, password);
    tokenStorage.setTokens(tokens.access, tokens.refresh);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(payload: RegisterPayload) {
    const { user: newUser, tokens } = await registerRequest(payload);
    tokenStorage.setTokens(tokens.access, tokens.refresh);
    setUser(newUser);
    return newUser;
  }

  async function logout() {
    const refreshToken = tokenStorage.getRefresh();
    try {
      if (refreshToken) await logoutRequest(refreshToken);
    } catch {
      // Even if the blacklist call fails (e.g. token already expired),
      // still clear local state so the user is logged out client-side.
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
