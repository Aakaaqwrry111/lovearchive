"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chat from "../../components/Chat";
import CommitLog from "../../components/CommitLog";
import { supabase } from "../../lib/supabaseClient";

export default function VaultPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let mounted = true;
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session);
      }
    };
    loadSession();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, authSession) => {
      setSession(authSession);
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session && status === "signed-out") {
      router.push("/");
    }
  }, [router, session, status]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/vault` : undefined
      }
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStatus("signed-out");
  };

  if (!session) {
    return (
      <section className="w-full max-w-md glass rounded-3xl p-8 text-center space-y-6">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-cyan">Vault Access Required</p>
          <h1 className="text-3xl font-semibold mt-3">Authenticate to enter</h1>
        </div>
        <p className="text-sm text-white/70">
          A magic link will be sent to your email. Only authenticated hearts may proceed.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-full px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full px-4 py-3 bg-cyan text-midnight font-semibold transition hover:brightness-110"
          >
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
        {status === "sent" && <p className="text-sm text-cyan">Check your inbox to continue.</p>}
        {status === "error" && (
          <p className="text-sm text-crimson">Something went wrong. Try again.</p>
        )}
      </section>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="uppercase tracking-[0.35em] text-xs text-cyan">Private Vault</p>
          <h1 className="text-3xl font-semibold">The Archive</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full px-5 py-2 border border-white/20 hover:border-cyan transition"
        >
          Sign out
        </button>
      </header>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Chat mode="ai" title="Love-GPT Historian" />
        <Chat mode="realtime" title="Private Realtime Chat" />
        <CommitLog />
      </section>
    </main>
  );
}
