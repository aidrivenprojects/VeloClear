export type RoleId="newpm"|"pm"|"programme"|"portfolio"|"sponsor"|"team";
export type DeliveryMethod="agile"|"hybrid"|"waterfall"|"safe";
export type ProjectComplexity="small"|"multi_team"|"enterprise"|"multi_vendor";
export type RiskFocus="vendor_dependency"|"scope_change"|"capacity"|"stakeholder_alignment"|"compliance";
export type IntentRole={id:RoleId;role:string;title:string;description:string;preview:string};
export type GeneratedProject={name:string;deliveryMethod:DeliveryMethod;complexity:ProjectComplexity;riskFocus:RiskFocus;narrative:string;phases:string[];governance:string[];stakeholders:string[];risks:{id:string;title:string;trigger:string;mitigation:string;owner:string;score:number}[]};
