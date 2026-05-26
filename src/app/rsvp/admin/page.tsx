"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Rsvp {
  id: number;
  name: string;
  email: string;
  attending: boolean;
  guest_count: number;
  adult_count: number;
  child_count: number;
  dietary_restrictions: string;
  potluck_dish: string;
  message: string;
  phone: string | null;
  mailing_address: string;
  attendee_names: string | null;
  public_display: boolean;
  created_at: string;
}

interface NewRsvpForm {
  name: string;
  email: string;
  phone: string;
  mailing_address: string;
  attending: boolean;
  adult_count: number;
  child_count: number;
  attendee_names: string;
  dietary_restrictions: string;
  message: string;
  public_display: boolean;
}

const emptyForm = (): NewRsvpForm => ({
  name: "",
  email: "",
  phone: "",
  mailing_address: "",
  attending: true,
  adult_count: 1,
  child_count: 0,
  attendee_names: "",
  dietary_restrictions: "",
  message: "",
  public_display: false,
});

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<NewRsvpForm>(emptyForm);

  const loadRsvps = () => {
    setLoading(true);
    fetch("/api/rsvp")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((json) => setRsvps(json.data ?? []))
      .catch(() => setError("Failed to load RSVPs"))
      .finally(() => setLoading(false));
  };

  useEffect(loadRsvps, []);

  const set = <K extends keyof NewRsvpForm>(key: K, value: NewRsvpForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveCreate = async () => {
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        adult_count: form.attending ? Math.max(1, Number(form.adult_count) || 1) : 0,
        child_count: form.attending ? Math.max(0, Number(form.child_count) || 0) : 0,
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-edit": "true",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create RSVP");
      setRsvps((prev) => [json.data, ...prev]);
      setForm(emptyForm());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create RSVP");
    } finally {
      setSaving(false);
    }
  };

  const deleteRsvp = async (id: number, name: string) => {
    if (!confirm(`Delete RSVP for ${name || "this guest"}?`)) return;

    try {
      const res = await fetch(`/api/rsvp?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete RSVP");
    }
  };

  const attending = rsvps.filter((r) => r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <h1 className="mb-2 text-center font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream">
          RSVP Admin
        </h1>
        <div className="mb-8 text-center">
          <Link href="/rsvp/admin/labels" className="text-sm text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light">
            Mailing lists & labels →
          </Link>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {error && (
          <div className="soft-card mx-auto mb-6 max-w-md p-4 text-center">
            <p className="text-sm text-deep-plum dark:text-cream">{error}</p>
            <button onClick={() => setError("")} className="mt-2 text-xs text-sage underline">Dismiss</button>
          </div>
        )}

        {!loading && (
          <>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveCreate();
              }}
              className="mb-8 space-y-6 rounded-[2rem] border border-white/50 bg-white/72 p-6 shadow-[0_18px_40px_rgba(95,61,87,0.12)] backdrop-blur-md dark:border-soft-gold/15 dark:bg-[#162618]/70 dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)] sm:p-8"
            >
              <div className="text-center">
                <div className="mb-2 text-sm font-medium tracking-widest text-sage uppercase dark:text-sage-light">Admin Entry</div>
                <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream">Add RSVP</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-deep-plum/70 dark:text-cream/70">
                  This matches the guest RSVP layout, but no fields are required for manual admin entries.
                </p>
              </div>

              <TextInput label="Your Name" value={form.name} onChange={(value) => set("name", value)} placeholder="Enter your name" />
              <TextInput label="Email Address" type="email" value={form.email} onChange={(value) => set("email", value)} placeholder="your@email.com" />
              <TextInput label="Phone Number" type="tel" value={form.phone} onChange={(value) => set("phone", value)} placeholder="(555) 123-4567" note="Optional for admin entries" />

              <div>
                <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Mailing Address</label>
                <textarea value={form.mailing_address} onChange={(e) => set("mailing_address", e.target.value)} placeholder="Street address, city, state, ZIP" className="enchanted-input min-h-[90px] resize-y" rows={3} />
                <p className="mt-1.5 text-xs text-deep-plum/75 dark:text-cream/75">Optional for admin entries</p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-deep-plum dark:text-cream">Will they be joining us?</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => set("attending", true)} className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${form.attending ? "border-soft-gold bg-soft-gold text-[#2A1A00] shadow-md" : "border-lavender/30 bg-warm-white text-deep-plum/80 hover:border-lavender/50 dark:border-sage/30 dark:bg-[#162618] dark:text-cream/80 dark:hover:border-sage/50"}`}>
                    Joyfully Accept
                  </button>
                  <button type="button" onClick={() => set("attending", false)} className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${!form.attending ? "border-[#8B7AA0] bg-[#8B7AA0] text-white shadow-md" : "border-lavender/30 bg-warm-white text-deep-plum/80 hover:border-lavender/50 dark:border-sage/30 dark:bg-[#162618] dark:text-cream/80 dark:hover:border-sage/50"}`}>
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {form.attending && (
                <div className="space-y-6 overflow-hidden">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Who Is Included in This RSVP?</label>
                    <textarea value={form.attendee_names} onChange={(e) => set("attendee_names", e.target.value)} placeholder="Guest names, one per line" className="enchanted-input min-h-[100px] resize-y" rows={4} />
                    <p className="mt-1.5 text-xs text-deep-plum/75 dark:text-cream/75">Optional. You can add notes like “Name (Adult)” or “Name (Child)” if helpful.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextInput label="Adults" type="number" value={String(form.adult_count)} onChange={(value) => set("adult_count", Number(value))} placeholder="Adults" />
                    <TextInput label="Children" type="number" value={String(form.child_count)} onChange={(value) => set("child_count", Number(value))} placeholder="Children" />
                  </div>

                  <TextInput label="Dietary Needs" value={form.dietary_restrictions} onChange={(value) => set("dietary_restrictions", value)} placeholder="Allergies, vegan, gluten-free..." note="Optional -- let us know about any food needs" />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Leave Us a Note</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="A kind word, a bit of advice, or just say hello..." className="enchanted-input min-h-[100px] resize-y" rows={3} />
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={form.public_display} onChange={(e) => set("public_display", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-sage/40 text-sage accent-sage" />
                <span className="text-sm text-deep-plum/80 dark:text-cream/80">Show this name on the celebration page so others can see they&apos;re coming</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setForm(emptyForm())} className="flex-1 rounded-xl border border-sage/30 px-6 py-3.5 text-sm font-medium text-deep-plum transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20">
                  Clear
                </button>
                <button type="submit" disabled={saving} className={`flex-1 rounded-xl bg-soft-gold px-6 py-3.5 text-base font-semibold text-[#2A1A00] shadow-md transition-all duration-300 hover:bg-soft-gold-dark hover:shadow-lg ${saving ? "cursor-wait opacity-70" : ""}`}>
                  {saving ? "Saving..." : "Add RSVP"}
                </button>
              </div>
            </form>

            <div className="soft-card mb-8 flex flex-wrap justify-center gap-8 p-6">
              <Stat label="Total RSVPs" value={rsvps.length} />
              <Stat label="Attending" value={attending.length} />
              <Stat label="Total Guests" value={totalGuests} />
              <Stat label="Declined" value={rsvps.length - attending.length} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {rsvps.map((r) => (
                <div key={r.id} className="soft-card flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-forest dark:text-cream">{r.name || "—"}</h3>
                      <p className="text-xs text-deep-plum/50 dark:text-cream/50">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${r.attending ? "bg-sage/20 text-sage" : "bg-lavender/20 text-lavender"}`}>{r.attending ? "Attending" : "Declined"}</span>
                      <button onClick={() => deleteRsvp(r.id, r.name)} className="text-xs font-medium text-red-400 underline underline-offset-2 hover:text-red-600">Delete</button>
                    </div>
                  </div>

                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                    <Field label="Email" value={r.email} />
                    <Field label="Phone" value={r.phone || "—"} />
                    {r.attending && <Field label="Guests" value={`${r.adult_count} adults · ${r.child_count} kids`} />}
                    {r.attending && <Field label="Guest names" value={r.attendee_names} multiline />}
                    {r.attending && <Field label="Dietary" value={r.dietary_restrictions} />}
                    <Field label="Mailing" value={r.mailing_address} multiline />
                    <Field label="Public" value={r.public_display ? "Yes" : "No"} />
                  </dl>

                  {r.message && (
                    <div className="mt-1 rounded-xl border border-soft-gold/30 bg-soft-gold/10 p-3 dark:border-soft-gold/20 dark:bg-soft-gold/5">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-soft-gold-dark dark:text-soft-gold">Note</div>
                      <p className="whitespace-pre-line text-sm text-deep-plum/80 dark:text-cream/80">{r.message}</p>
                    </div>
                  )}
                </div>
              ))}
              {rsvps.length === 0 && <p className="col-span-full py-8 text-center text-deep-plum/50 dark:text-cream/50">No RSVPs yet</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text", note }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; note?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="enchanted-input" />
      {note && <p className="mt-1.5 text-xs text-deep-plum/75 dark:text-cream/75">{note}</p>}
    </div>
  );
}

function Field({ label, value, multiline }: { label: string; value: string | null; multiline?: boolean }) {
  return (
    <>
      <dt className="text-xs font-medium uppercase tracking-wider text-deep-plum/50 dark:text-cream/50">{label}</dt>
      <dd className={`text-deep-plum/80 dark:text-cream/80 ${multiline ? "whitespace-pre-line" : "break-words"}`}>{value || "—"}</dd>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream">{value}</div>
      <div className="text-xs uppercase tracking-wider text-deep-plum/60 dark:text-cream/60">{label}</div>
    </div>
  );
}
