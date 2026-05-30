"use client";
import {useEffect} from "react";
import {usePathname,useRouter} from "next/navigation";
import {useAuth} from "@/components/auth/AuthProvider";
const PUBLIC=["/","/demo","/auth"];
export function RequireAuth({children}:{children:React.ReactNode}){
 const {user,loading}=useAuth(); const pathname=usePathname(); const router=useRouter();
 const pub=PUBLIC.some(p=>pathname===p||pathname.startsWith(p+"/"));
 useEffect(()=>{if(!loading&&!user&&!pub)router.replace(`/auth?next=${encodeURIComponent(pathname)}`)},[loading,user,pub,pathname,router]);
 if(pub) return <>{children}</>;
 if(loading) return <div className="min-h-screen bg-page p-8"><div className="rounded-3xl border border-border bg-white p-6 text-sm font-black text-ink">Checking authorization…</div></div>;
 if(!user) return <div className="min-h-screen bg-page p-8"><div className="rounded-3xl border border-border bg-white p-6 text-sm font-black text-ink">Redirecting to sign in…</div></div>;
 return <>{children}</>;
}
