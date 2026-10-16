"use client";

/* The outer net for the disputation: if something throws outside a view (the views have
   their own boundary inside the Shell), the reader gets a plain notice and a way back
   instead of Next's blank "Application error". Inline styles, since the disputation's
   stylesheet may be what failed to load. */

import { useEffect } from "react";

export default function DisputationError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.warn("[disputation] the page failed to render", error);
    document.documentElement.removeAttribute("data-atl-deep");
  }, [error]);

  const again = () => {
    // A bad link (#/…) is the likeliest cause: start again from the map.
    try {
      history.replaceState(history.state, "", "#/");
    } catch {
      /* ignore */
    }
    reset();
  };

  return (
    // <main>: on this route the site's layout leaves the landmark to the disputation.
    <main style={{ minHeight: "100vh", background: "#171922", color: "#ebe5d6", padding: "120px 16px 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", fontFamily: "var(--atl-sans), system-ui, sans-serif" }}>
        <h1 style={{ margin: "0 0 12px", fontFamily: "var(--atl-serif), Georgia, serif", fontWeight: 400, fontSize: "2rem", lineHeight: 1.15 }}>
          Something went wrong on this page.
        </h1>
        <p style={{ margin: "0 0 24px", color: "#a6a394", lineHeight: 1.6 }}>Your marks are kept. You can start again from the map.</p>
        <button
          type="button"
          onClick={again}
          style={{
            minHeight: 44,
            padding: "0 18px",
            borderRadius: 999,
            border: "1px solid #6b6f82",
            background: "transparent",
            color: "#ebe5d6",
            font: "500 12px/1 var(--atl-mono), ui-monospace, monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Back to the map
        </button>
      </div>
    </main>
  );
}
