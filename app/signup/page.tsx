import { signUp } from "@/lib/actions";
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-8">
      <form action={signUp} className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Create account</h1>
        <p className="mt-2 text-sm text-muted">Create your Supabase Auth account.</p>
        <input name="email" type="email" required placeholder="Email" className="mt-6 w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
        <input name="password" type="password" required placeholder="Password" className="mt-3 w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
        <button className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-black text-white">Create account</button>
        {params.error && <p className="mt-3 rounded-xl bg-redBg p-3 text-xs font-bold text-red">{params.error}</p>}
        <a href="/login" className="mt-5 block text-center text-xs font-black text-accent">Sign in</a>
      </form>
    </main>
  );
}
