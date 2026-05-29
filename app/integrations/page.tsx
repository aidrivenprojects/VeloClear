export const dynamic = "force-dynamic";

import {AppShell} from "@/components/layout/AppShell";import {IntegrationsGrid} from "@/components/integrations/IntegrationsGrid";export default function Page(){return <AppShell title="Integrations" kicker="Platform"><IntegrationsGrid/></AppShell>}