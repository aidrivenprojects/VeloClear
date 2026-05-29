import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-page p-8">
      <div className="max-w-xl rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">VeloClear</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Delivery Intelligence OS</p>
        <Link href="/demo" className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-black text-white">Open demo</Link>
      </div>
    </main>
  );
}
