"use client";

const RSVP_URL = "https://brooker.family/sapphire";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=0&color=244A2B&data=${encodeURIComponent(RSVP_URL)}`;

export default function SapphirePrint() {
  return (
    <div className="print-root">
      {/* Top action bar - hidden on print */}
      <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[8.5in] items-center justify-between px-4 py-3">
          <p className="text-sm text-slate-600">
            Sapphire&apos;s birthday invitation — printable
          </p>
          <div className="flex items-center gap-2">
            <a
              href="/sapphire"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Back
            </a>
            <a
              href="/sapphire/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Open PDF
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[8.5in] px-4 pb-3">
          <p className="text-xs text-slate-500">
            Tip: in the print dialog, choose &ldquo;Save as PDF&rdquo; as the destination.
            Soft fairy-forest colors, matching the Sapphire page.
          </p>
        </div>
      </div>

      {/* The actual letter-sized invitation page */}
      <div className="mx-auto my-6 print:my-0">
        <div className="invite">
          <div className="invite-glow invite-glow-left" />
          <div className="invite-glow invite-glow-right" />

          {/* Decorative top border */}
          <div className="invite-border-top">
            <DecorativeFlourish />
          </div>

          {/* Header */}
          <div className="invite-header">
            <p className="invite-eyebrow">You are most kindly invited to</p>
            <h1 className="invite-name">Sapphire&apos;s</h1>
            <div className="invite-gem-row">
              <span className="invite-divider" />
              <FairyWingMark />
              <span className="invite-divider" />
            </div>
            <h2 className="invite-occasion">
              Fairy Forest 9<sup>th</sup> Birthday
            </h2>
            <p className="invite-sub">A fun filled day at Moreau Lake</p>
            <p className="invite-intro">
              Sapphire is turning 9 years old! Join us for a fun filled day at
              Moreau Lake to celebrate with swimming, pizza, and cake.
            </p>
          </div>

          {/* Big date */}
          <div className="invite-date-box">
            <p className="invite-label">Save the Date</p>
            <p className="invite-day">Saturday</p>
            <p className="invite-fullDate">
              <span className="invite-month">June</span>{" "}
              <span className="invite-num">20</span>
              <span className="invite-comma">,</span>{" "}
              <span className="invite-year">2026</span>
            </p>
            <p className="invite-time">11:00 AM &mdash; 3:00 PM</p>
          </div>

          {/* Two-column detail row */}
          <div className="invite-grid">
            <div className="invite-col">
              <p className="invite-label">Where</p>
              <p className="invite-where">
                Moreau Lake<br />State Park
              </p>
              <p className="invite-where-sub">
                605 Old Saratoga Rd<br />
                Gansevoort, NY
              </p>
            </div>
            <div className="invite-col invite-col-divider">
              <p className="invite-label">What to Expect</p>
              <ul className="invite-list">
                <li>Pizza &amp; snacks</li>
                <li>Birthday cake</li>
                <li>Swimming &ndash; bring suits &amp; towels</li>
                <li>Playground near the beach</li>
              </ul>
            </div>
          </div>

          {/* RSVP / QR row */}
          <div className="invite-rsvp-row">
            <div className="invite-rsvp-text">
              <p className="invite-label">Kindly RSVP</p>
              <p className="invite-rsvp-url">brooker.family/sapphire</p>
              <p className="invite-rsvp-hint">
                Scan the QR code to RSVP online or send us a text at{" "}
                <strong>814-876-2231</strong>.
              </p>
            </div>
            <div className="invite-qr-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={QR_SRC} alt={`QR code linking to ${RSVP_URL}`} className="invite-qr" />
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @page {
          size: letter portrait;
          margin: 0.5in;
        }

        @media print {
          .no-print { display: none !important; }
          html, body { background: white !important; }
          .print-root { background: white !important; padding: 0 !important; }
          .invite {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0.25in 0.4in !important;
            max-width: 100% !important;
            width: 100% !important;
            min-height: auto !important;
            page-break-inside: avoid;
          }
        }

        .print-root {
          background: #f5f5f4;
          min-height: 100vh;
        }

        .invite {
          font-family: var(--font-quicksand), system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          width: 8.5in;
          min-height: 11in;
          max-width: 100%;
          background:
            radial-gradient(circle at 18% 12%, rgba(244, 184, 196, 0.34), transparent 25%),
            radial-gradient(circle at 84% 18%, rgba(221, 231, 176, 0.5), transparent 28%),
            linear-gradient(180deg, #e8f0dd 0%, #f1ead5 42%, #faead8 76%, #f5c6d0 100%);
          color: #244a2b;
          border: 1px solid rgba(120, 89, 124, 0.22);
          box-shadow: 0 18px 50px rgba(36, 74, 43, 0.13);
          padding: 0.75in 0.6in;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .invite-glow {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(22px);
          opacity: 0.36;
        }

        .invite-glow-left {
          top: 0.35in;
          left: 0.2in;
          width: 1.5in;
          height: 1.5in;
          background: #f4b8c4;
        }

        .invite-glow-right {
          right: 0.25in;
          bottom: 1.1in;
          width: 1.65in;
          height: 1.65in;
          background: #dde7b0;
        }

        .invite-border-top {
          display: flex;
          justify-content: center;
          margin-bottom: 0.3in;
          color: #78597c;
        }

        .invite-header {
          position: relative;
          text-align: center;
        }

        .invite-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #78597c;
          margin: 0 0 14px 0;
        }

        .invite-name {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 78px;
          line-height: 1;
          font-weight: 600;
          color: #244a2b;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .invite-gem-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 14px 0;
          color: #78597c;
        }

        .invite-divider {
          display: inline-block;
          width: 90px;
          height: 1px;
          background: #78597c;
          opacity: 0.55;
        }

        .invite-occasion {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 48px;
          line-height: 1.05;
          font-weight: 500;
          color: #78597c;
          margin: 0;
          font-style: italic;
        }

        .invite-occasion sup {
          font-size: 0.5em;
          font-style: normal;
        }

        .invite-sub {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 18px;
          font-style: italic;
          color: #38653a;
          margin: 8px 0 0 0;
        }

        .invite-intro {
          max-width: 5.7in;
          margin: 16px auto 0 auto;
          font-size: 14px;
          line-height: 1.55;
          color: #244a2b;
        }

        .invite-date-box {
          margin: 0.35in auto 0.2in auto;
          padding: 18px 20px;
          border: 1px solid rgba(120, 89, 124, 0.34);
          border-radius: 18px;
          text-align: center;
          max-width: 5.5in;
          background: rgba(255, 255, 255, 0.4);
        }

        .invite-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #78597c;
          margin: 0 0 6px 0;
        }

        .invite-day {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 22px;
          font-style: italic;
          color: #38653a;
          margin: 0 0 2px 0;
        }

        .invite-fullDate {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 52px;
          line-height: 1;
          font-weight: 600;
          color: #244a2b;
          margin: 0;
        }

        .invite-month {
          font-style: italic;
          font-weight: 500;
        }

        .invite-comma {
          font-weight: 400;
        }

        .invite-time {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #78597c;
          margin: 10px 0 0 0;
        }

        .invite-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.3in;
          margin: 0.15in 0;
          position: relative;
        }

        .invite-col {
          text-align: left;
        }

        .invite-col-divider {
          padding-left: 0.3in;
          border-left: 1px solid rgba(120, 89, 124, 0.24);
        }

        .invite-where {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 26px;
          line-height: 1.1;
          font-weight: 600;
          color: #244a2b;
          margin: 0 0 6px 0;
        }

        .invite-where-sub {
          font-size: 13px;
          line-height: 1.4;
          color: #38653a;
          margin: 0;
        }

        .invite-list {
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 13px;
          line-height: 1.7;
          color: #244a2b;
        }

        .invite-list li::before {
          content: "•";
          color: #78597c;
          margin-right: 8px;
          font-size: 12px;
        }

        .invite-no-gifts {
          margin: 10px 0 0 0;
          font-size: 12px;
          font-style: italic;
          color: #6b7280;
        }

        .invite-rsvp-row {
          margin-top: auto;
          padding-top: 0.25in;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.3in;
          align-items: center;
          position: relative;
        }

        .invite-rsvp-text {
          text-align: left;
        }

        .invite-rsvp-url {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 28px;
          font-weight: 600;
          color: #244a2b;
          margin: 4px 0 6px 0;
          letter-spacing: 0.01em;
        }

        .invite-rsvp-hint {
          font-size: 12px;
          color: #38653a;
          margin: 0;
          max-width: 3in;
        }

        .invite-qr-wrap {
          padding: 8px;
          border: 1px solid rgba(120, 89, 124, 0.34);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.65);
        }

        .invite-qr {
          display: block;
          width: 1.4in;
          height: 1.4in;
        }

      `}</style>
    </div>
  );
}

function DecorativeFlourish({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="240"
      height="20"
      viewBox="0 0 240 20"
      fill="none"
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      <path
        d="M10 10 Q40 2 70 10 T130 10 T190 10 Q220 10 230 4"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
      <circle cx="120" cy="10" r="2.5" fill="currentColor" />
      <circle cx="50" cy="9" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="190" cy="11" r="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function FairyWingMark() {
  return (
    <svg width="34" height="28" viewBox="0 0 34 28" fill="none" aria-hidden="true">
      <path d="M16 13 C8 1 1 3 2 12 C3 20 11 23 16 16 Z" fill="#F4B8C4" opacity="0.72" stroke="#78597C" strokeWidth="0.8" />
      <path d="M18 13 C26 1 33 3 32 12 C31 20 23 23 18 16 Z" fill="#F4B8C4" opacity="0.72" stroke="#78597C" strokeWidth="0.8" />
      <path d="M15 16 C8 21 8 28 15 25 C18 24 18 18 16 16 Z" fill="#DDE7B0" opacity="0.78" stroke="#78597C" strokeWidth="0.7" />
      <path d="M19 16 C26 21 26 28 19 25 C16 24 16 18 18 16 Z" fill="#DDE7B0" opacity="0.78" stroke="#78597C" strokeWidth="0.7" />
      <ellipse cx="17" cy="15" rx="1.6" ry="7" fill="#FFF7D0" stroke="#78597C" strokeWidth="0.5" />
      <circle cx="17" cy="7" r="2" fill="#FFF7D0" stroke="#78597C" strokeWidth="0.5" />
    </svg>
  );
}
