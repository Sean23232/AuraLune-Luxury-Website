"use client";
import { useState } from "react";

export function NewsletterForm({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!valid) {
      setState("error");
      setMsg("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("success");
      setMsg(data.message || "You're on the list.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const light = tone === "light";
  if (state === "success") {
    return <p className={`text-sm ${light ? "text-lavender" : "text-plum"} serif text-xl`}>✦ {msg}</p>;
  }
  return (
    <form onSubmit={submit} noValidate className={compact ? "space-y-3" : "flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"}>
      <label className="sr-only" htmlFor={`nl-${tone}-${compact}`}>Email address</label>
      <input
        id={`nl-${tone}-${compact}`}
        type="email"
        required
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
        placeholder="Email address"
        className={`input ${light ? "input-light" : ""} ${compact ? "" : "flex-1"}`}
        aria-invalid={state === "error"}
      />
      <button type="submit" disabled={state === "loading"} className={`btn ${light ? "btn-light" : "btn-primary"} ${compact ? "w-full" : ""}`}>
        {state === "loading" ? "Joining…" : "Join the List"}
      </button>
      {state === "error" && <p role="alert" className={`text-xs ${light ? "text-lavender" : "text-plum"} sm:absolute sm:mt-14`}>{msg}</p>}
    </form>
  );
}
