import { ToolPage } from "@/components/cdos/CDOSPages";
export default async function Page({params}:{params:Promise<{id:string;phase:string;tool:string}>}){const {id,phase,tool}=await params;return <ToolPage id={id} phase={phase} tool={tool}/>}
