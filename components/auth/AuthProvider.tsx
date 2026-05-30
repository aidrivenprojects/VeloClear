"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getDemoRole, getPermissions, getSession, signOut, type Permission, type RoleName } from "@/lib/authRBAC";

type AuthContextValue = {
  user: any;
  session: any;
  role: RoleName;
  permissions: Permission[];
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  role: "Project Manager",
  permissions: [],
  loading: true,
  refresh: async () => {},
  logout: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<RoleName>("Project Manager");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const sessionValue = await getSession();
    const userValue = await getCurrentUser();
    const roleValue = getDemoRole();
    const perms = await getPermissions(roleValue);
    setSession(sessionValue);
    setUser(userValue);
    setRole(roleValue);
    setPermissions(perms);
    setLoading(false);
  }

  async function logout() {
    await signOut();
    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, role, permissions, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
