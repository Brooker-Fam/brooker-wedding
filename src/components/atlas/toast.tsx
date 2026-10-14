"use client";

/* One quiet toast at a time, bottom-center, with an optional action (Undo).
   Used to explain verdict changes: "Objection I is now answered — because …". */

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export interface ToastMsg {
  text: ReactNode;
  action?: { label: string; run: () => void };
  /** ms; default 5200 */
  ttl?: number;
  tone?: "plain" | "tension";
}

const Ctx = createContext<(t: ToastMsg) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<(ToastMsg & { key: number }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((t: ToastMsg) => {
    if (timer.current) clearTimeout(timer.current);
    setMsg({ ...t, key: Date.now() });
    timer.current = setTimeout(() => setMsg(null), t.ttl ?? 5200);
  }, []);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="toast-dock" aria-live="polite">
        <AnimatePresence>
          {msg && (
            <motion.div
              key={msg.key}
              className={`toast ${msg.tone === "tension" ? "tension" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            >
              <span className="toast-text">{msg.text}</span>
              {msg.action && (
                <button
                  type="button"
                  className="toast-act"
                  onClick={() => {
                    // Clear first, so a toast the action itself raises survives.
                    const run = msg.action!.run;
                    setMsg(null);
                    run();
                  }}
                >
                  {msg.action.label}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
