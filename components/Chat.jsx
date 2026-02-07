"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const MAX_LENGTH = 280;
const COOLDOWN_MS = 1500;

export default function Chat({ mode, title }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [cooldown, setCooldown] = useState(0);
  const [userId, setUserId] = useState(null);
  const [systemMessage, setSystemMessage] = useState("");
  const bottomRef = useRef(null);
  const cooldownRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUserId(data.user?.id ?? null);
    };
    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, systemMessage]);

  useEffect(() => {
    if (mode !== "realtime" || !userId) return undefined;
    let channel;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, content, created_at, user_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(40);
      if (data) setMessages(data);
    };

    loadMessages();

    channel = supabase
      .channel(`messages-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `user_id=eq.${userId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
  }, [mode, userId]);

  const handleSend = async () => {
    if (!input.trim() || status === "loading") return;
    if (input.length > MAX_LENGTH) return;
    const now = Date.now();
    if (now - cooldownRef.current < COOLDOWN_MS) {
      setCooldown(COOLDOWN_MS - (now - cooldownRef.current));
      return;
    }
    cooldownRef.current = now;
    setCooldown(0);

    if (mode === "realtime") {
      setStatus("loading");
      const payload = { content: input.trim(), user_id: userId };
      const { error } = await supabase.from("messages").insert(payload);
      if (error) {
        setStatus("error");
        return;
      }
      setInput("");
      setStatus("idle");
      return;
    }

    setStatus("loading");
    const userMessage = { id: `local-${Date.now()}`, content: input.trim(), role: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let memories = [];
    if (userId) {
      const { data: memoryRows } = await supabase
        .from("ai_memory")
        .select("memory")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(3);
      memories = memoryRows?.map((row) => row.memory) ?? [];
    }

    const response = await fetch("/api/love-gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: userMessage.content,
        memories
      })
    });

    if (!response.ok || !response.body) {
      setStatus("error");
      return;
    }

    const reader = response.body.getReader();
    let output = "";
    setSystemMessage("");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      output += new TextDecoder().decode(value);
      setSystemMessage(output);
    }

    if (
      userId &&
      (userMessage.content.length > 40 || userMessage.content.toLowerCase().includes("remember"))
    ) {
      await supabase.from("ai_memory").insert({
        user_id: userId,
        memory: userMessage.content
      });
    }

    setStatus("idle");
  };

  return (
    <section className="glass rounded-3xl p-6 flex flex-col min-h-[420px]">
      <div className="mb-4">
        <p className="uppercase tracking-[0.3em] text-xs text-cyan">{title}</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 text-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 ${
              message.role === "user" || message.user_id ? "bg-white/10" : "bg-white/5"
            }`}
          >
            {message.content}
          </div>
        ))}
        {systemMessage && (
          <div className="rounded-2xl px-4 py-3 bg-white/5 terminal whitespace-pre-wrap">
            {systemMessage}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="mt-4 space-y-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder={mode === "ai" ? "Speak to the historian..." : "Send a message..."}
          className="w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan resize-none"
        />
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{input.length}/{MAX_LENGTH}</span>
          {cooldown > 0 && <span>Slow down... {Math.ceil(cooldown / 1000)}s</span>}
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={status === "loading" || !input.trim()}
          className="w-full rounded-full px-4 py-3 bg-cyan text-midnight font-semibold disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>
        {status === "error" && (
          <p className="text-xs text-crimson">Something went wrong. Try again shortly.</p>
        )}
      </div>
    </section>
  );
}
