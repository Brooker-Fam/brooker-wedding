"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import HeartGarland from "@/components/HeartGarland";

interface RsvpData {
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
  attendee_names: string;
  public_display: boolean;
  created_at: string;
  updated_at?: string;
}

type GuestType = "adult" | "child";

interface AttendeeEntry {
  name: string;
  type: GuestType;
}

function parseAttendeeEntries(raw: string | undefined, fallbackAdults: number, fallbackChildren: number, primaryName?: string): AttendeeEntry[] {
  const lines = (raw ?? "")
    .split(/\n+/)
    .flatMap((line) => line.split(","))
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 0) {
    return lines.map((line) => {
      const adultMatch = line.match(/\s*\((adult|child)\)\s*$/i);
      if (adultMatch) {
        return {
          name: line.replace(/\s*\((adult|child)\)\s*$/i, "").trim(),
          type: adultMatch[1].toLowerCase() === "child" ? "child" : "adult",
        };
      }

      return { name: line, type: "adult" };
    });
  }

  const entries: AttendeeEntry[] = [];
  const adults = Math.max(1, fallbackAdults || 1);
  const children = Math.max(0, fallbackChildren || 0);

  for (let i = 0; i < adults; i++) {
    entries.push({ name: i === 0 ? primaryName ?? "" : "", type: "adult" });
  }

  for (let i = 0; i < children; i++) {
    entries.push({ name: "", type: "child" });
  }

  return entries.length > 0 ? entries : [{ name: primaryName ?? "", type: "adult" }];
}

function serializeAttendeeEntries(entries: AttendeeEntry[]): string {
  return entries
    .map((entry) => ({ ...entry, name: entry.name.trim() }))
    .filter((entry) => entry.name)
    .map((entry) => `${entry.name} (${entry.type === "child" ? "Child" : "Adult"})`)
    .join("\n");
}

type PageState = "loading" | "fresh" | "lookup" | "viewing" | "editing" | "success";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge = 31536000) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge}`;
}

export default function RSVPPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const id = getCookie("rsvp_id");
    if (!id) {
      setPageState("fresh");
      return;
    }
    fetch(`/api/rsvp?id=${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.data) {
          setRsvpData(json.data);
          setPageState("viewing");
        } else {
          setPageState("fresh");
        }
      })
      .catch(() => setPageState("fresh"));
  }, []);

  const handleSuccess = useCallback((data: RsvpData) => {
    setRsvpData(data);
    setCookie("rsvp_id", String(data.id));
    setShowConfetti(true);
    setPageState("success");
    setTimeout(() => {
      setShowConfetti(false);
      setPageState("viewing");
    }, 3500);
  }, []);

  const handleFound = useCallback((data: RsvpData) => {
    setRsvpData(data);
    setCookie("rsvp_id", String(data.id));
    setPageState("viewing");
  }, []);

  return (
    <div className="enchanted-bg min-h-screen">
      <ConfettiCelebration active={showConfetti} />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <AnimatePresence mode="wait">
          {pageState === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center">
              <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </motion.div>
          )}

          {pageState === "fresh" && (
            <motion.div key="fresh" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PageHeader />
              <RsvpForm isEditing={false} onSuccess={handleSuccess} />
              <div className="mt-6 text-center">
                <button onClick={() => setPageState("lookup")} className="text-sm text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light dark:hover:text-sage">
                  Already RSVP&apos;d? Look up your response
                </button>
              </div>
              <PageFooter />
            </motion.div>
          )}

          {pageState === "lookup" && (
            <motion.div key="lookup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PageHeader />
              <RsvpLookup onFound={handleFound} onBack={() => setPageState("fresh")} />
              <PageFooter />
            </motion.div>
          )}

          {pageState === "viewing" && rsvpData && (
            <motion.div key="viewing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PageHeader />
              <RsvpViewer data={rsvpData} onEdit={() => setPageState("editing")} />
              <PageFooter />
            </motion.div>
          )}

          {pageState === "editing" && rsvpData && (
            <motion.div key="editing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PageHeader />
              <RsvpForm isEditing initialData={rsvpData} onSuccess={handleSuccess} onCancel={() => setPageState("viewing")} />
              <PageFooter />
            </motion.div>
          )}

          {pageState === "success" && rsvpData && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
              <div className="soft-card mx-auto max-w-md p-8 sm:p-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="mb-6">
                  <svg className="mx-auto h-16 w-16 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream">
                  {rsvpData.attending ? "We Can\u2019t Wait to Celebrate With You!" : "We\u2019ll Miss You!"}
                </h2>
                <p className="mt-4 text-base text-deep-plum/70 dark:text-cream/70">
                  {rsvpData.name}, your RSVP has been saved.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {pageState !== "loading" && <WhosComingSection />}
      </div>
    </div>
  );
}

/* ── PLACEHOLDER SUB-COMPONENTS (will be filled in next edit) ── */

function PageHeader() {
  return (
    <div className="mb-10 text-center">
      <HeartGarland size="lg" className="mb-5" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-3 text-sm font-medium tracking-widest text-sage uppercase dark:text-sage-light">
        You&apos;re Invited
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream sm:text-5xl">
        Join Our Celebration
      </motion.h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 rounded-[2rem] border border-[#9CAF88]/20 bg-gradient-to-br from-[#F8FBF4] via-[#FDF8F0] to-[#F2D7D5]/28 p-6 shadow-[0_18px_45px_rgba(156,175,136,0.14)] dark:border-soft-gold/30 dark:bg-[#162618]/70 dark:shadow-[0_4px_20px_rgba(196,154,60,0.15)] sm:p-8">
        <p className="mb-5 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight lining-nums text-[#2D5016] dark:text-[#FDF8F0] sm:text-5xl">
          Saturday, June 27, 2026
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.6rem] border border-[#9CAF88]/15 bg-gradient-to-br from-white via-[#F8FBF4] to-[#F6EBDD] px-5 py-4 shadow-[0_12px_24px_rgba(156,175,136,0.12)] dark:border-soft-gold/15 dark:bg-[#1B2C1D]/80 dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <p className="mb-1 font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.24em] text-[#9CAF88] uppercase dark:text-[#A8C090]">
              Arrival
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight lining-nums text-[#2D5016] dark:text-[#FDF8F0] sm:text-4xl">
              <span>12:30</span>{" "}
              <span className="text-lg sm:text-xl">PM</span>
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-[#B8A9C9]/18 bg-gradient-to-br from-white via-[#FBF7FC] to-[#F2D7D5]/40 px-5 py-4 shadow-[0_12px_24px_rgba(184,169,201,0.14)] dark:border-soft-gold/15 dark:bg-[#1B2C1D]/80 dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <p className="mb-1 font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.24em] text-[#9CAF88] uppercase dark:text-[#A8C090]">
              Ceremony
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight lining-nums text-[#2D5016] dark:text-[#FDF8F0] sm:text-4xl">
              <span>1:00</span>{" "}
              <span className="text-lg sm:text-xl">PM</span>
            </p>
          </div>
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-3 text-base text-deep-plum/60 dark:text-cream/60">
        We would be so happy to have you there. Please let us know if you can make it!
      </motion.p>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mx-auto mt-6 flex items-center justify-center gap-3">
        <div className="h-px w-16 bg-sage/40 dark:bg-sage/30" />
        <svg width="20" height="20" viewBox="0 0 20 20" className="text-sage/60">
          <path d="M10 2 C10 2, 4 8, 10 14 C16 8, 10 2, 10 2Z" fill="currentColor" />
          <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="h-px w-16 bg-sage/40 dark:bg-sage/30" />
      </motion.div>
    </div>
  );
}

function PageFooter() {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-sage/70 dark:text-sage-light/70">June 27, 2026 · Ceremony at 1:00 PM</p>
    </div>
  );
}
function RsvpForm({ initialData, isEditing, onSuccess, onCancel }: { initialData?: RsvpData; isEditing: boolean; onSuccess: (d: RsvpData) => void; onCancel?: () => void }) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [attending, setAttending] = useState(initialData?.attending ?? true);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(initialData?.dietary_restrictions ?? "");
  const [potluckDish, setPotluckDish] = useState(initialData?.potluck_dish ?? "");
  const [message, setMessage] = useState(initialData?.message ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [mailingAddress, setMailingAddress] = useState(initialData?.mailing_address ?? "");
  const [attendeeEntries, setAttendeeEntries] = useState<AttendeeEntry[]>(
    parseAttendeeEntries(
      initialData?.attendee_names,
      initialData?.adult_count ?? 1,
      initialData?.child_count ?? 0,
      initialData?.name ?? ""
    )
  );
  const [publicDisplay, setPublicDisplay] = useState(initialData?.public_display ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErrorMessage("Please enter your name so we know who to expect!"); return; }
    if (!email.trim() || !email.includes("@")) { setErrorMessage("We need a valid email to keep you updated!"); return; }
    if (!phone.trim()) { setErrorMessage("Please include a phone number so we can reach you if needed."); return; }
    if (!mailingAddress.trim()) { setErrorMessage("Please include your mailing address."); return; }
    const filledAttendees = attendeeEntries.filter((entry) => entry.name.trim());
    const adultCount = filledAttendees.filter((entry) => entry.type === "adult").length;
    const childCount = filledAttendees.filter((entry) => entry.type === "child").length;
    if (attending && filledAttendees.length === 0) { setErrorMessage("Please list at least one guest name for this RSVP."); return; }
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        ...(isEditing && initialData ? { id: initialData.id } : {}),
        name: name.trim(), email: email.trim(), attending,
        adult_count: attending ? adultCount : 0,
        child_count: attending ? childCount : 0,
        dietary_restrictions: dietaryRestrictions.trim(),
        potluck_dish: potluckDish.trim(),
        message: message.trim(),
        mailing_address: mailingAddress.trim(),
        attendee_names: attending ? serializeAttendeeEntries(attendeeEntries) : "",
        public_display: publicDisplay,
        phone: phone.trim(),
      };
      const res = await fetch("/api/rsvp", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onSuccess(data.data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit. Please try again!");
      setSubmitting(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-6 rounded-[2rem] border border-white/50 bg-white/72 p-6 shadow-[0_18px_40px_rgba(95,61,87,0.12)] backdrop-blur-md dark:border-soft-gold/15 dark:bg-[#162618]/70 dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)] sm:p-8">
      <div>
        <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Your Name <span className="text-soft-gold">*</span></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="enchanted-input" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Email Address <span className="text-soft-gold">*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="enchanted-input" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Phone Number <span className="text-soft-gold">*</span></label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="enchanted-input" required />
        <p className="mt-1.5 text-xs text-deep-plum/55 dark:text-cream/55">Required -- we may text any updates about the celebration</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Mailing Address <span className="text-soft-gold">*</span></label>
        <textarea
          value={mailingAddress}
          onChange={(e) => setMailingAddress(e.target.value)}
          placeholder="Street address, city, state, ZIP"
          className="enchanted-input min-h-[90px] resize-y"
          rows={3}
          required
        />
        <p className="mt-1.5 text-xs text-deep-plum/55 dark:text-cream/55">Required -- helpful for sending any mail your way</p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-deep-plum dark:text-cream">Will you be joining us?</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => {
            setAttending(true);
            setAttendeeEntries((prev) => prev.length > 0 ? prev : [{ name: name.trim(), type: "adult" }]);
          }} className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${attending ? "border-soft-gold bg-soft-gold text-white shadow-md" : "border-lavender/30 bg-warm-white text-deep-plum/65 hover:border-lavender/50 dark:border-sage/30 dark:bg-[#162618] dark:text-cream/65 dark:hover:border-sage/50"}`}>
            Joyfully Accept
          </button>
          <button type="button" onClick={() => setAttending(false)} className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${!attending ? "border-lavender bg-lavender text-white shadow-md" : "border-lavender/30 bg-warm-white text-deep-plum/65 hover:border-lavender/50 dark:border-sage/30 dark:bg-[#162618] dark:text-cream/65 dark:hover:border-sage/50"}`}>
            Regretfully Decline
          </button>
        </div>
      </div>

      <AnimatePresence>
        {attending && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="space-y-6 overflow-hidden">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-deep-plum dark:text-cream">Who Is Included in This RSVP?</label>
                <button
                  type="button"
                  onClick={() => setAttendeeEntries((prev) => [...prev, { name: "", type: "adult" }])}
                  className="rounded-lg border border-sage/30 px-3 py-1.5 text-xs font-medium text-sage transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-sage-light dark:hover:bg-sage/20"
                >
                  Add Guest
                </button>
              </div>
              <div className="space-y-3">
                {attendeeEntries.map((entry, index) => (
                  <div key={index} className="rounded-2xl border border-sage/15 bg-warm-white/70 p-4 dark:border-sage/20 dark:bg-[#162618]/60">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        value={entry.name}
                        onChange={(e) =>
                          setAttendeeEntries((prev) =>
                            prev.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: e.target.value } : item
                            )
                          )
                        }
                        placeholder={`Guest ${index + 1} name`}
                        className="enchanted-input flex-1"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setAttendeeEntries((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, type: "adult" } : item
                              )
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${entry.type === "adult" ? "bg-soft-gold text-white shadow-sm" : "border border-sage/30 text-deep-plum hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20"}`}
                        >
                          Adult
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setAttendeeEntries((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, type: "child" } : item
                              )
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${entry.type === "child" ? "bg-lavender text-white shadow-sm" : "border border-sage/30 text-deep-plum hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20"}`}
                        >
                          Child
                        </button>
                        {attendeeEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setAttendeeEntries((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                            className="rounded-lg border border-blush-dark/30 px-3 py-2 text-xs font-medium text-deep-plum transition-all hover:bg-blush/30 dark:border-blush-dark/40 dark:text-cream dark:hover:bg-blush-dark/20"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-deep-plum/55 dark:text-cream/55">
                {attendeeEntries.filter((entry) => entry.name.trim() && entry.type === "adult").length} adults · {attendeeEntries.filter((entry) => entry.name.trim() && entry.type === "child").length} children
              </div>
              <p className="mt-1.5 text-xs text-deep-plum/55 dark:text-cream/55">
                Please add a guest row for each person included with this RSVP.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Dietary Needs</label>
              <input type="text" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} placeholder="Allergies, vegan, gluten-free..." className="enchanted-input" />
              <p className="mt-1.5 text-xs text-deep-plum/55 dark:text-cream/55">Optional -- let us know about any food needs</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">Leave Us a Note</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A kind word, a bit of advice, or just say hello..." className="enchanted-input min-h-[100px] resize-y" rows={3} />
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={publicDisplay} onChange={(e) => setPublicDisplay(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-sage/40 text-sage accent-sage" />
          <span className="text-sm text-deep-plum/80 dark:text-cream/80">Show my name on the celebration page so others can see you&apos;re coming</span>
        </label>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-blush-dark/30 bg-blush/40 p-4 dark:border-blush-dark/40 dark:bg-blush-dark/20">
            <p className="text-sm font-medium text-deep-plum dark:text-blush-light">Oops!</p>
            <p className="mt-1 text-sm text-deep-plum/80 dark:text-cream/80">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-sage/30 px-6 py-3.5 text-sm font-medium text-deep-plum transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className={`${isEditing && onCancel ? "flex-1" : "w-full"} rounded-xl bg-soft-gold px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-soft-gold-dark hover:shadow-lg ${submitting ? "cursor-wait opacity-70" : ""}`}>
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Sending...
            </span>
          ) : isEditing ? "Update RSVP" : "Send RSVP"}
        </button>
      </div>
    </motion.form>
  );
}
function RsvpViewer({ data, onEdit }: { data: RsvpData; onEdit: () => void }) {
  return (
    <div className="soft-card p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${data.attending ? "bg-sage/20 text-sage" : "bg-lavender/20 text-lavender"}`}>
          {data.attending ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-deep-plum dark:text-cream">{data.name}</h3>
          <p className="text-sm text-deep-plum/60 dark:text-cream/60">{data.email}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {data.phone && (
          <div className="flex justify-between border-b border-sage/10 pb-2 dark:border-sage/20">
            <span className="text-deep-plum/60 dark:text-cream/60">Phone</span>
            <span className="font-medium text-deep-plum dark:text-cream">{data.phone}</span>
          </div>
        )}
        {data.mailing_address && (
          <div className="border-b border-sage/10 pb-2 dark:border-sage/20">
            <span className="text-deep-plum/60 dark:text-cream/60">Mailing Address</span>
            <p className="mt-1 whitespace-pre-line font-medium text-deep-plum dark:text-cream">{data.mailing_address}</p>
          </div>
        )}
        <div className="flex justify-between border-b border-sage/10 pb-2 dark:border-sage/20">
          <span className="text-deep-plum/60 dark:text-cream/60">Status</span>
          <span className="font-medium text-deep-plum dark:text-cream">{data.attending ? "Joyfully Attending" : "Regretfully Declining"}</span>
        </div>
        {data.attending && (
          <div className="flex justify-between border-b border-sage/10 pb-2 dark:border-sage/20">
            <span className="text-deep-plum/60 dark:text-cream/60">Guests</span>
            <span className="font-medium text-deep-plum dark:text-cream">{data.adult_count} {data.adult_count === 1 ? "adult" : "adults"}{data.child_count > 0 ? `, ${data.child_count} ${data.child_count === 1 ? "child" : "children"}` : ""}</span>
          </div>
        )}
        {data.dietary_restrictions && (
          <div className="flex justify-between border-b border-sage/10 pb-2 dark:border-sage/20">
            <span className="text-deep-plum/60 dark:text-cream/60">Dietary Needs</span>
            <span className="font-medium text-deep-plum dark:text-cream">{data.dietary_restrictions}</span>
          </div>
        )}
        {data.attendee_names && (
          <div className="border-b border-sage/10 pb-2 dark:border-sage/20">
            <span className="text-deep-plum/60 dark:text-cream/60">Guests Included</span>
            <p className="mt-1 whitespace-pre-line font-medium text-deep-plum dark:text-cream">{data.attendee_names}</p>
          </div>
        )}
        {data.message && (
          <div className="border-b border-sage/10 pb-2 dark:border-sage/20">
            <span className="text-deep-plum/60 dark:text-cream/60">Your Note</span>
            <p className="mt-1 font-medium text-deep-plum dark:text-cream">{data.message}</p>
          </div>
        )}
        <div className="flex justify-between pb-2">
          <span className="text-deep-plum/60 dark:text-cream/60">Show Name Publicly</span>
          <span className="font-medium text-deep-plum dark:text-cream">{data.public_display ? "Yes" : "No"}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button onClick={onEdit} className="flex-1 rounded-xl bg-soft-gold px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-soft-gold-dark hover:shadow-md">
          Edit Your RSVP
        </button>
        <Link href="/details" className="flex flex-1 items-center justify-center rounded-xl border border-sage/30 px-6 py-3 text-sm font-medium text-deep-plum transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20">
          View Details
        </Link>
      </div>
    </div>
  );
}
function RsvpLookup({ onFound, onBack }: { onFound: (d: RsvpData) => void; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{ id: number; name: string; email: string; attending: boolean }[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (search.trim().length < 2) return;
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      fetch(`/api/rsvp/lookup?q=${encodeURIComponent(search.trim())}`)
        .then((r) => r.json())
        .then((json) => {
          const data = json.data ?? [];
          setResults(data);
          setSearched(true);
          if (data.length === 1) {
            fetch(`/api/rsvp?id=${data[0].id}`)
              .then((r) => r.json())
              .then((full) => { if (full?.data) onFound(full.data); });
          }
        })
        .catch(() => { setResults([]); setSearched(true); setError("Something went wrong. Please try again."); })
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [search, onFound]);

  const selectResult = (id: number) => {
    setLoading(true);
    fetch(`/api/rsvp?id=${id}`)
      .then((r) => r.json())
      .then((json) => { if (json?.data) onFound(json.data); })
      .finally(() => setLoading(false));
  };

  return (
    <div className="soft-card p-6 sm:p-8">
      <h3 className="mb-4 text-center font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-forest dark:text-cream">
        Find Your RSVP
      </h3>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter your name or email"
          className="enchanted-input"
          autoFocus
        />
      </div>

      {loading && (
        <div className="py-4 text-center">
          <svg className="mx-auto h-6 w-6 animate-spin text-sage" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        </div>
      )}

      {!loading && error && (
        <p className="py-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <p className="py-4 text-center text-sm text-deep-plum/60 dark:text-cream/60">No results found. Try a different name or email.</p>
      )}

      {!loading && results.length > 1 && (
        <div className="space-y-2">
          {results.map((r) => (
            <button key={r.id} onClick={() => selectResult(r.id)} className="w-full rounded-xl border border-sage/20 p-3 text-left transition-all hover:border-sage/50 hover:bg-sage/5 dark:border-sage/30 dark:hover:bg-sage/10">
              <span className="font-medium text-deep-plum dark:text-cream">{r.name}</span>
              <span className="ml-2 text-sm text-deep-plum/50 dark:text-cream/50">{r.email}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <button onClick={onBack} className="text-sm text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light dark:hover:text-sage">
          Back to RSVP form
        </button>
      </div>
    </div>
  );
}
function WhosComingSection() {
  const [names, setNames] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/rsvp/public")
      .then((r) => r.json())
      .then((json) => {
        setNames(json.names ?? []);
        setTotal(json.total ?? 0);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || (names.length === 0 && total === 0)) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12">
      <div className="soft-card p-6 sm:p-8">
        <h3 className="mb-4 text-center font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-forest dark:text-cream">
          Who&apos;s Coming
        </h3>
        {total > 0 && (
          <p className="mb-4 text-center text-sm text-deep-plum/60 dark:text-cream/60">
            {total} {total === 1 ? "guest" : "guests"} attending so far
          </p>
        )}
        {names.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {names.map((n, i) => (
              <span key={i} className="rounded-full bg-sage/10 px-3 py-1 text-sm text-sage dark:bg-sage/20 dark:text-sage-light">
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
