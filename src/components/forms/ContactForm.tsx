"use client";
import { useState } from "react";

const SUBJECTS = ["General enquiry", "Product question", "Order support", "Wholesale / partnership", "Press", "Other"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.subject) e.subject = "Please choose a subject.";
    if (form.message.trim().length < 10) e.message = "Please share a little more detail (10+ characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setState("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send your message.");
      setState("success");
      setServerMsg(data.message);
    } catch (err) {
      setState("error");
      setServerMsg(err instanceof Error ? err.message : "Unable to send your message.");
    }
  }

  if (state === "success") {
    return (
      <div className="border hairline p-10 text-center bg-cloud/60">
        <p className="serif text-3xl">Thank you.</p>
        <p className="mt-3 text-sm text-midnight/70 max-w-sm mx-auto">{serverMsg}</p>
      </div>
    );
  }

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value }),
    "aria-invalid": !!errors[k],
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="eyebrow !text-[0.6rem] text-midnight/60 block mb-2" htmlFor="c-name">Name</label>
          <input id="c-name" className="input" placeholder="Your name" {...field("name")} />
          {errors.name && <p className="text-xs text-plum mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="eyebrow !text-[0.6rem] text-midnight/60 block mb-2" htmlFor="c-email">Email</label>
          <input id="c-email" type="email" className="input" placeholder="you@example.com" {...field("email")} />
          {errors.email && <p className="text-xs text-plum mt-1">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label className="eyebrow !text-[0.6rem] text-midnight/60 block mb-2" htmlFor="c-subject">Subject</label>
        <select id="c-subject" className="input bg-ivory" {...field("subject")}>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="eyebrow !text-[0.6rem] text-midnight/60 block mb-2" htmlFor="c-message">Message</label>
        <textarea id="c-message" rows={6} className="input resize-y" placeholder="How can we help?" {...field("message")} />
        {errors.message && <p className="text-xs text-plum mt-1">{errors.message}</p>}
      </div>
      {state === "error" && <p role="alert" className="text-sm text-plum">{serverMsg}</p>}
      <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full sm:w-auto">
        {state === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
