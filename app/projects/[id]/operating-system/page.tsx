import { OS } from "@/components/cdos/CDOSPages";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <OS id={id}/>}
