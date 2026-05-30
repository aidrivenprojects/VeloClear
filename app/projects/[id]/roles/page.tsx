import { RolesPage } from "@/components/enterprise/EnterprisePages";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <RolesPage projectId={id}/>}
