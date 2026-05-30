import Link from "next/link";
export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-8">
      <div className="max-w-xl rounded-3xl border border-border bg-white p-10 text-center shadow-sm">
        <h1 className="text-5xl font-black tracking-[-0.06em] text-ink">VeloClear</h1>
        <p className="mt-4 text-sm leading-6 text-ink2">Production-grade Connected Delivery Operating System on Supabase + Vercel.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="rounded-xl bg-accent px-5 py-3 text-sm font-black text-white">Sign in</Link>
          <Link href="/signup" className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-black text-ink">Create account</Link>
        </div>
      </div>
    </main>
  );
}
