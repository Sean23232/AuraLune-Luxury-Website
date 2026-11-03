"use client";
import { useCallback, useEffect, useState } from "react";
import type { ProductWithVariants } from "@/lib/catalog";

type Settings = Record<string, string>;
type Integrations = { payments: boolean; newsletter: boolean; email: boolean };

export function AdminClient({ requiresPassword }: { requiresPassword: boolean }) {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(!requiresPassword);
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [integrations, setIntegrations] = useState<Integrations | null>(null);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"products" | "settings">("products");

  const headers = useCallback(() => ({ "Content-Type": "application/json", ...(pw ? { Authorization: `Bearer ${pw}` } : {}) }), [pw]);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([fetch("/api/admin/products", { headers: headers() }), fetch("/api/admin/settings", { headers: headers() })]);
    if (p.status === 401 || s.status === 401) { setAuthed(false); setMsg("Incorrect password."); return; }
    setProducts((await p.json()).products);
    const sj = await s.json();
    setSettings(sj.settings); setIntegrations(sj.integrations); setAuthed(true); setMsg("");
  }, [headers]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  async function api(url: string, method: string, body: unknown) {
    const r = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
    if (!r.ok) { const d = await r.json().catch(() => ({})); setMsg(d.error || "Request failed"); return null; }
    setMsg("Saved ✦"); setTimeout(() => setMsg(""), 1500);
    return r.json();
  }

  if (!authed) {
    return (
      <section className="mx-auto max-w-sm px-6 py-32">
        <p className="eyebrow text-plum mb-3">Store Admin</p>
        <h1 className="text-4xl tracking-wide">Sign in</h1>
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); load(); }}>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password" className="input" />
          {msg && <p className="text-xs text-plum">{msg}</p>}
          <button className="btn btn-primary w-full">Enter</button>
        </form>
        <p className="mt-6 text-xs text-midnight/50">Set <code>ADMIN_PASSWORD</code> in the environment to secure this area.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-plum mb-2">Store Admin</p>
          <h1 className="text-4xl tracking-wide">Manage Auralune</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className={`eyebrow !text-[0.6rem] px-3 py-1.5 ${settings.store_mode === "live" ? "bg-midnight text-ivory" : "bg-lavender/60"}`}>{settings.store_mode === "live" ? "Live Selling" : "Preview Mode"}</span>
          <span className="text-xs text-plum min-w-16">{msg}</span>
        </div>
      </div>
      {!requiresPassword && <p className="mt-4 text-xs text-plum border border-plum/30 p-3">This admin area is open because <code>ADMIN_PASSWORD</code> is not set. Set it before going live.</p>}

      <div className="mt-8 flex gap-6 border-b hairline">
        {(["products", "settings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`eyebrow !text-[0.62rem] pb-3 border-b-2 capitalize ${tab === t ? "border-midnight" : "border-transparent text-midnight/50"}`}>{t}</button>
        ))}
      </div>

      {tab === "settings" && integrations && (
        <div className="mt-8 grid lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            <h2 className="text-2xl">Store Settings</h2>
            <label className="block text-sm">
              <span className="eyebrow !text-[0.58rem] text-midnight/60 block mb-1">Store mode</span>
              <select className="input bg-ivory" value={settings.store_mode} onChange={(e) => setSettings({ ...settings, store_mode: e.target.value })}>
                <option value="preview">Preview (no purchasing — "Coming Soon")</option>
                <option value="live">Live (Add to Bag + checkout enabled)</option>
              </select>
            </label>
            {[["announcement", "Announcement bar"], ["instagram_url", "Instagram URL"], ["tiktok_url", "TikTok URL"], ["facebook_url", "Facebook URL"], ["contact_email", "Public contact email (optional)"]].map(([k, l]) => (
              <label key={k} className="block text-sm">
                <span className="eyebrow !text-[0.58rem] text-midnight/60 block mb-1">{l}</span>
                <input className="input" value={settings[k] || ""} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} />
              </label>
            ))}
            {[["shipping_note", "Shipping note (shown on product pages, FAQ, policy)"], ["returns_note", "Returns note"]].map(([k, l]) => (
              <label key={k} className="block text-sm">
                <span className="eyebrow !text-[0.58rem] text-midnight/60 block mb-1">{l}</span>
                <textarea rows={3} className="input" value={settings[k] || ""} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} />
              </label>
            ))}
            <button className="btn btn-primary" onClick={async () => { const d = await api("/api/admin/settings", "PATCH", settings); if (d) setSettings(d.settings); }}>Save Settings</button>
          </div>
          <div>
            <h2 className="text-2xl">Integrations</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Payments (Stripe Checkout)", integrations.payments, "STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL"],
                ["Newsletter sync (Mailchimp / Klaviyo)", integrations.newsletter, "MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID or KLAVIYO_API_KEY + KLAVIYO_LIST_ID"],
                ["Contact email delivery (Resend)", integrations.email, "RESEND_API_KEY, CONTACT_TO_EMAIL"],
              ].map(([l, ok, env]) => (
                <li key={String(l)} className="border hairline p-4">
                  <div className="flex justify-between"><span>{l}</span><span className={ok ? "text-twilight" : "text-plum"}>{ok ? "Configured" : "Not configured"}</span></div>
                  <p className="text-xs text-midnight/50 mt-1">Env: {env}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-midnight/55 leading-relaxed">Newsletter signups and contact messages are always stored in the database, even before external providers are connected. Checkout is disabled until the store is Live and payments are configured — no payment is ever simulated.</p>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="mt-8 space-y-10">
          <NewProduct onCreate={async (b) => { if (await api("/api/admin/products", "POST", b)) load(); }} />
          {products.map((p) => <ProductEditor key={p.id} p={p} api={api} reload={load} />)}
        </div>
      )}
    </section>
  );
}

function NewProduct({ onCreate }: { onCreate: (b: unknown) => void }) {
  const [f, setF] = useState({ name: "", texture: "straight", lengths: '14", 16", 18", 20", 22", 24"', basePriceCents: 0, images: "/images/product-straight.jpg" });
  return (
    <div className="border hairline p-5 bg-cloud/50">
      <p className="eyebrow !text-[0.6rem] text-plum mb-3">Add Product</p>
      <div className="grid md:grid-cols-5 gap-3">
        <input className="input bg-ivory" placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <select className="input bg-ivory" value={f.texture} onChange={(e) => setF({ ...f, texture: e.target.value })}><option>straight</option><option>curly</option><option>wavy</option></select>
        <input className="input bg-ivory" placeholder='Lengths (comma separated)' value={f.lengths} onChange={(e) => setF({ ...f, lengths: e.target.value })} />
        <input className="input bg-ivory" type="number" placeholder="Base price (cents)" value={f.basePriceCents} onChange={(e) => setF({ ...f, basePriceCents: Number(e.target.value) })} />
        <input className="input bg-ivory" placeholder="Image URLs (comma separated)" value={f.images} onChange={(e) => setF({ ...f, images: e.target.value })} />
      </div>
      <button className="btn btn-primary mt-3 !py-2.5" disabled={!f.name} onClick={() => onCreate({ ...f, lengths: f.lengths.split(",").map((s) => s.trim()).filter(Boolean), images: f.images.split(",").map((s) => s.trim()).filter(Boolean), published: false })}>Create (unpublished)</button>
    </div>
  );
}

function ProductEditor({ p, api, reload }: { p: ProductWithVariants; api: (u: string, m: string, b: unknown) => Promise<unknown>; reload: () => void }) {
  const [d, setD] = useState({ name: p.name, description: p.description, details: p.details, careNotes: p.careNotes, images: p.images.join(", "), published: p.published, featured: p.featured, isPlaceholder: p.isPlaceholder, sortOrder: p.sortOrder });
  const [vars, setVars] = useState(p.variants);
  const [newLen, setNewLen] = useState("");
  const stock = p.variants.reduce((n, v) => n + v.inventory, 0);
  return (
    <details className="border hairline">
      <summary className="cursor-pointer list-none p-5 flex flex-wrap items-center gap-4">
        <span className="serif text-2xl">{p.name}</span>
        <span className="eyebrow !text-[0.55rem] text-midnight/50">{p.texture}</span>
        <span className={`eyebrow !text-[0.55rem] px-2 py-0.5 ${p.published ? "bg-midnight text-ivory" : "bg-lavender/60"}`}>{p.published ? "Published" : "Unpublished"}</span>
        {p.isPlaceholder && <span className="eyebrow !text-[0.55rem] border hairline px-2 py-0.5">Sample</span>}
        <span className="ml-auto text-xs text-midnight/55">{p.variants.length} variants · {stock} in stock</span>
      </summary>
      <div className="p-5 pt-0 grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <input className="input" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
          <textarea className="input" rows={3} placeholder="Description" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
          <textarea className="input" rows={2} placeholder="Product details" value={d.details} onChange={(e) => setD({ ...d, details: e.target.value })} />
          <textarea className="input" rows={2} placeholder="Care notes" value={d.careNotes} onChange={(e) => setD({ ...d, careNotes: e.target.value })} />
          <input className="input" placeholder="Image URLs, comma separated" value={d.images} onChange={(e) => setD({ ...d, images: e.target.value })} />
          <div className="flex flex-wrap gap-5 text-sm">
            {(["published", "featured", "isPlaceholder"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 capitalize"><input type="checkbox" checked={d[k]} onChange={(e) => setD({ ...d, [k]: e.target.checked })} />{k === "isPlaceholder" ? "Sample / placeholder" : k}</label>
            ))}
            <label className="flex items-center gap-2">Order <input type="number" className="input !w-20 !py-1" value={d.sortOrder} onChange={(e) => setD({ ...d, sortOrder: Number(e.target.value) })} /></label>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-primary !py-2.5" onClick={async () => { if (await api("/api/admin/products", "PATCH", { id: p.id, ...d, images: d.images.split(",").map((s) => s.trim()).filter(Boolean) })) reload(); }}>Save Product</button>
            <button className="btn btn-outline !py-2.5" onClick={async () => { if (confirm("Delete this product and all variants?")) { await api("/api/admin/products", "DELETE", { id: p.id }); reload(); } }}>Delete</button>
          </div>
        </div>
        <div>
          <p className="eyebrow !text-[0.6rem] text-plum mb-3">Variants — length, price, inventory</p>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[0.6rem] uppercase tracking-wider text-midnight/50"><th className="py-1">Length</th><th>Price (cents)</th><th>Stock</th><th>Avail.</th><th></th></tr></thead>
            <tbody>
              {vars.map((v, i) => (
                <tr key={v.id} className="border-t hairline">
                  <td className="py-2 pr-2"><input className="input !py-1 !px-2 !w-20" value={v.length} onChange={(e) => setVars(vars.map((x, j) => (j === i ? { ...x, length: e.target.value } : x)))} /></td>
                  <td className="pr-2"><input className="input !py-1 !px-2 !w-28" type="number" value={v.priceCents} onChange={(e) => setVars(vars.map((x, j) => (j === i ? { ...x, priceCents: Number(e.target.value) } : x)))} /></td>
                  <td className="pr-2"><input className="input !py-1 !px-2 !w-20" type="number" value={v.inventory} onChange={(e) => setVars(vars.map((x, j) => (j === i ? { ...x, inventory: Number(e.target.value) } : x)))} /></td>
                  <td><input type="checkbox" checked={v.available} onChange={(e) => setVars(vars.map((x, j) => (j === i ? { ...x, available: e.target.checked } : x)))} /></td>
                  <td className="text-right whitespace-nowrap">
                    <button className="text-xs underline mr-3" onClick={() => api("/api/admin/variants", "PATCH", v)}>Save</button>
                    <button className="text-xs text-plum underline" onClick={async () => { await api("/api/admin/variants", "DELETE", { id: v.id }); reload(); }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-2">
            <input className="input !py-1.5 !w-28" placeholder='e.g. 26"' value={newLen} onChange={(e) => setNewLen(e.target.value)} />
            <button className="btn btn-outline !py-1.5" disabled={!newLen} onClick={async () => { await api("/api/admin/variants", "POST", { productId: p.id, length: newLen, priceCents: 0, inventory: 0, sortOrder: vars.length }); setNewLen(""); reload(); }}>Add Length</button>
          </div>
          <p className="mt-3 text-xs text-midnight/50">A variant is purchasable only when the store is Live, it is available, stock &gt; 0 and price &gt; 0.</p>
        </div>
      </div>
    </details>
  );
}
