import { Phase } from "@/components/cdos/CDOSPages";
export default async function Page({params}:{params:Promise<{id:string;phase:string}>}){const {id,phase}=await params;return <Phase id={id} phase={phase}/>}
