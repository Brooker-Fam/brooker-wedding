/* Small marks shared by the Shell and the overview (styles live in shell.css,
   which is always loaded):
   - StatusPip: an objection's status on the reader's calls — ▲ ochre filled =
     stands, ● verdigris filled = answered, hollow = undecided.
   - YouMark: ■, the reader (the Master who rules), drawn like primitives' Glyph. */

import type { Label } from "../types";

export function StatusPip({ label, size = 10, className = "" }: { label: Label; size?: number; className?: string }) {
  return (
    <svg className={`st-pip p-${label} ${className}`} viewBox="0 0 10 10" width={size} height={size} aria-hidden focusable="false">
      {label === "in" ? <path d="M5 1.2 9.1 8.6H.9z" /> : <circle cx="5" cy="5" r={label === "out" ? 3.6 : 3.3} />}
    </svg>
  );
}

/** ■ the reader. Same box and stroke as `Glyph` so the four marks sit at one weight. */
export function YouMark({ size = 12, className = "" }: { size?: number; className?: string }) {
  const i = size * 0.14;
  return (
    <svg className={`glyph-svg you-mark ${className}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden focusable="false">
      <rect x={i} y={i} width={size - 2 * i} height={size - 2 * i} />
    </svg>
  );
}
