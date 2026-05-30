"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { roleOptions, setDemoRole, type RoleName } from "@/lib/authRBAC";

export function RoleSwitcher() {
  const { role, refresh, user, logout } = useAuth();

  async function changeRole(next: RoleName) {
    setDemoRole(next);
    await refresh();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Access Role</div>
      <select
        value={role}
        onChange={(event) => changeRole(event.target.value as RoleName)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-white outline-none"
      >
        {roleOptions.map((item) => <option key={item} value={item} className="text-black">{item}</option>)}
      </select>
      {user ? (
        <button onClick={logout} className="mt-3 w-full rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-white">Sign out</button>
      ) : (
        <div className="mt-2 text-[11px] font-bold leading-5 text-white/45">Demo mode until signed in.</div>
      )}
    </div>
  );
}
