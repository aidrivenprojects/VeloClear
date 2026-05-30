import { signIn } from "@/lib/actions";
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-8">
      <form action={signIn} className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Supabase Auth protected workspace.</p>
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <input name="email" type="email" required placeholder="Email" className="mt-6 w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
        <input name="password" type="password" required placeholder="Password" className="mt-3 w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
        <button className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-black text-white">Sign in</button>
        {params.error && <p className="mt-3 rounded-xl bg-redBg p-3 text-xs font-bold text-red">{params.error}</p>}
        {params.message && <p className="mt-3 rounded-xl bg-greenBg p-3 text-xs font-bold text-green">{params.message}</p>}
        <a href="/signup" className="mt-5 block text-center text-xs font-black text-accent">Create account</a>
      </form>
    </main>
  );
}
