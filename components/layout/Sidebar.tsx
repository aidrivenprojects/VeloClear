"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";
import { RoleSwitcher } from "@/components/auth/RoleSwitcher";

const groups=[
 {label:"Portfolio",items:[{label:"Dashboard",href:"/dashboard"},{label:"Programmes",href:"/programmes"},{label:"Projects",href:"/projects"}]},
 {label:"Create",items:[{label:"+ New Project",href:"/new-project"},{label:"Workflow Ingestion",href:"/ingest"}]},
 {label:"Configuration",items:[{label:"Methodology Packs",href:"/methodology"},{label:"Roles",href:"/roles"},{label:"Integrations",href:"/integrations"}]},
 {label:"Governance",items:[{label:"Reports",href:"/reports"},{label:"Audit Trail",href:"/audit"}]},
 {label:"Intelligence",items:[{label:"Operating System",href:"/operating-system"},{label:"Demo Graph",href:"/trace"}]},
 {label:"Access",items:[{label:"Sign in / RBAC",href:"/auth"}]}
];
function active(p:string,h:string){return h==="/projects"?p==="/projects":p===h||p.startsWith(`${h}/`)}
export function Sidebar(){const pathname=usePathname();return <aside className="fixed inset-y-0 left-0 z-20 hidden w-[280px] overflow-y-auto bg-sidebar px-4 py-5 text-white lg:block"><Brand dark/><div className="my-6"><RoleSwitcher/></div><nav className="space-y-6 pb-10">{groups.map(g=><section key={g.label} className="rounded-2xl bg-white/[0.025] p-2"><div className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">{g.label}</div><div className="grid gap-1">{g.items.map(i=><Link key={i.href} href={i.href} className={active(pathname,i.href)?"rounded-xl bg-white/10 px-3 py-2 text-sm font-black text-white":"rounded-xl px-3 py-2 text-sm font-bold text-white/55 hover:bg-white/5 hover:text-white"}>{i.label}</Link>)}</div></section>)}</nav></aside>}
