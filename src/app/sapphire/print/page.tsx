"use client";

const RSVP_URL = "https://brooker.family/sapphire";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=0&color=1B2A5C&data=${encodeURIComponent(RSVP_URL)}`;

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
            Black &amp; white friendly — single soft-navy accent.
          </p>
        </div>
      </div>

      {/* The actual letter-sized invitation page */}
      <div className="mx-auto my-6 print:my-0">
        <div className="invite">
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
              <GemMark />
              <span className="invite-divider" />
            </div>
            <h2 className="invite-occasion">
              Magical 9<sup>th</sup> Birthday
            </h2>
            <p className="invite-sub">A fairy-princess celebration in the forest</p>
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
                <li>Pizza, cake &amp; lemonade</li>
                <li>Swimming &mdash; bring suits &amp; towels</li>
                <li>Forest treasure hunt</li>
                <li>Games &amp; whimsy</li>
                <li>Sunscreen &amp; comfy shoes</li>
              </ul>
              <p className="invite-no-gifts">No gifts, please &mdash; just bring yourself.</p>
            </div>
          </div>

          {/* RSVP / QR row */}
          <div className="invite-rsvp-row">
            <div className="invite-rsvp-text">
              <p className="invite-label">Kindly RSVP</p>
              <p className="invite-rsvp-url">brooker.family/sapphire</p>
              <p className="invite-rsvp-hint">Scan the code, or text Matt or Brittany.</p>
            </div>
            <div className="invite-qr-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={QR_SRC} alt={`QR code linking to ${RSVP_URL}`} className="invite-qr" />
            </div>
          </div>

          {/* Footer */}
          <div className="invite-footer">
            <DecorativeFlourish flip />
            <p className="invite-signoff">with love, Sapphire</p>
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
          width: 8.5in;
          min-height: 11in;
          max-width: 100%;
          background: #ffffff;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
          padding: 0.75in 0.6in;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .invite-border-top {
          display: flex;
          justify-content: center;
          margin-bottom: 0.3in;
          color: #1B2A5C;
        }

        .invite-header {
          text-align: center;
        }

        .invite-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0 0 14px 0;
        }

        .invite-name {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 78px;
          line-height: 1;
          font-weight: 600;
          color: #1B2A5C;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .invite-gem-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 14px 0;
          color: #1B2A5C;
        }

        .invite-divider {
          display: inline-block;
          width: 90px;
          height: 1px;
          background: #1B2A5C;
          opacity: 0.55;
        }

        .invite-occasion {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 48px;
          line-height: 1.05;
          font-weight: 500;
          color: #1f2937;
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
          color: #4b5563;
          margin: 8px 0 0 0;
        }

        .invite-date-box {
          margin: 0.35in auto 0.2in auto;
          padding: 18px 20px;
          border: 1px solid #1B2A5C;
          border-radius: 4px;
          text-align: center;
          max-width: 5.5in;
        }

        .invite-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #1B2A5C;
          margin: 0 0 6px 0;
        }

        .invite-day {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 22px;
          font-style: italic;
          color: #4b5563;
          margin: 0 0 2px 0;
        }

        .invite-fullDate {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 52px;
          line-height: 1;
          font-weight: 600;
          color: #1B2A5C;
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
          color: #374151;
          margin: 10px 0 0 0;
        }

        .invite-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.3in;
          margin: 0.15in 0;
        }

        .invite-col {
          text-align: left;
        }

        .invite-col-divider {
          padding-left: 0.3in;
          border-left: 1px solid #d1d5db;
        }

        .invite-where {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 26px;
          line-height: 1.1;
          font-weight: 600;
          color: #1B2A5C;
          margin: 0 0 6px 0;
        }

        .invite-where-sub {
          font-size: 13px;
          line-height: 1.4;
          color: #4b5563;
          margin: 0;
        }

        .invite-list {
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 13px;
          line-height: 1.7;
          color: #1f2937;
        }

        .invite-list li::before {
          content: "✦";
          color: #1B2A5C;
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
        }

        .invite-rsvp-text {
          text-align: left;
        }

        .invite-rsvp-url {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 28px;
          font-weight: 600;
          color: #1B2A5C;
          margin: 4px 0 6px 0;
          letter-spacing: 0.01em;
        }

        .invite-rsvp-hint {
          font-size: 12px;
          color: #4b5563;
          margin: 0;
          max-width: 3in;
        }

        .invite-qr-wrap {
          padding: 8px;
          border: 1px solid #1B2A5C;
          border-radius: 4px;
          background: #ffffff;
        }

        .invite-qr {
          display: block;
          width: 1.4in;
          height: 1.4in;
        }

        .invite-footer {
          text-align: center;
          margin-top: 0.25in;
          color: #1B2A5C;
        }

        .invite-signoff {
          font-family: var(--font-cormorant-garamond), Georgia, serif;
          font-size: 20px;
          font-style: italic;
          color: #4b5563;
          margin: 10px 0 0 0;
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

function GemMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <polygon
        points="16,4 26,11 26,21 16,28 6,21 6,11"
        stroke="#1B2A5C"
        strokeWidth="1.4"
        fill="none"
      />
      <polygon points="16,4 21,8.5 16,13 11,8.5" stroke="#1B2A5C" strokeWidth="1" fill="none" />
      <line x1="11" y1="8.5" x2="6" y2="11" stroke="#1B2A5C" strokeWidth="1" opacity="0.6" />
      <line x1="21" y1="8.5" x2="26" y2="11" stroke="#1B2A5C" strokeWidth="1" opacity="0.6" />
      <line x1="11" y1="8.5" x2="16" y2="28" stroke="#1B2A5C" strokeWidth="1" opacity="0.5" />
      <line x1="21" y1="8.5" x2="16" y2="28" stroke="#1B2A5C" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="21" x2="26" y2="21" stroke="#1B2A5C" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
