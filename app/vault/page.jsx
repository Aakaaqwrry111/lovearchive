"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chat from "../../components/Chat";
import CommitLog from "../../components/CommitLog";

const STORAGE_KEY = "vault_local_auth";

export default function VaultPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setAuthed(true);
      const parsed = JSON.parse(saved);
      setEmail(parsed.email || "");
      setPassword(parsed.password || "");
    }
  }, []);

  useEffect(() => {
    if (!authed && status === "signed-out") {
      router.push("/");
    }
  }, [router, authed, status]);

  const handleLogin = (event) => {
    event.preventDefault();
    setStatus("loading");
    if (!email || !password) {
      setStatus("error");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
    setAuthed(true);
    setStatus("success");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setStatus("signed-out");
  };

  if (!authed) {
    return (
      <section className="w-full max-w-md glass rounded-3xl p-8 text-center space-y-6">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-cyan">Vault Access Required</p>
          <h1 className="text-3xl font-semibold mt-3">Authenticate to enter</h1>
        </div>
        <p className="text-sm text-white/70">
          Enter your email + password to continue. No email verification required.
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
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-full px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full px-4 py-3 bg-cyan text-midnight font-semibold transition hover:brightness-110"
          >
            {status === "loading" ? "Signing in..." : "Continue"}
          </button>
        </form>
        {status === "success" && <p className="text-sm text-cyan">Welcome back.</p>}
        {status === "error" && (
          <p className="text-sm text-crimson">Please enter both email and password.</p>
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
