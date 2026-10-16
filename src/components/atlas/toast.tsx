"use client";

/* One toast at a time, bottom-center, with an optional action (Undo).
   Used to say what a call changed, e.g. "Objection I is now answered, because you said … fails."
   The timer pauses while the pointer is over the toast or focus is inside it, a toast with an
   action stays at least 10 seconds, and the Shell dismisses any toast when the view changes
   (its Undo belongs to the view that raised it). Escape dismisses it (unless a card or the
   menu is open, which Escape closes first), and while it shows it publishes its height as
   --toast-h, so a control focused from the keyboard is scrolled clear of it (shell.css).
   Reduced motion: the MotionConfig in Atlas turns the slide into a plain fade. */

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export interface ToastMsg {
  text: ReactNode;
  action?: { label: string; run: () => void };
  /** ms; default 5200 (at least 10000 when there is an action) */
  ttl?: number;
  tone?: "plain" | "tension";
}

const Ctx = createContext<(t: ToastMsg) => void>(() => {});
const DismissCtx = createContext<() => void>(() => {});
export const useToast = () => useContext(Ctx);
/** Close the current toast, if any (the Shell calls it on every change of view). */
export const useToastDismiss = () => useContext(DismissCtx);

const ACTION_MIN = 10000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<(ToastMsg & { key: number }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Time left on the current toast, and when its timer last (re)started.
  const left = useRef(0);
  const since = useRef(0);
  const hold = useRef({ pointer: false, focus: false });

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const run = useCallback(() => {
    stop();
    since.current = Date.now();
    timer.current = setTimeout(() => setMsg(null), Math.max(0, left.current));
  }, []);
  const pause = () => {
    if (!timer.current) return;
    stop();
    left.current -= Date.now() - since.current;
  };
  const resume = () => {
    if (hold.current.pointer || hold.current.focus || timer.current) return;
    left.current = Math.max(left.current, 2500);
    run();
  };

  const show = useCallback(
    (t: ToastMsg) => {
      hold.current = { pointer: false, focus: false };
      setMsg({ ...t, key: Date.now() });
      left.current = t.action ? Math.max(t.ttl ?? 0, ACTION_MIN) : (t.ttl ?? 5200);
      run();
    },
    [run],
  );
  const dismiss = useCallback(() => {
    stop();
    hold.current = { pointer: false, focus: false };
    setMsg(null);
  }, []);
  useEffect(() => () => stop(), []);

  // Publish the toast's height while it shows (as peek.tsx does with --peek-h).
  const box = useRef<HTMLDivElement>(null);
  const shown = msg?.key;
  useLayoutEffect(() => {
    const el = box.current;
    if (shown === undefined || !el) return;
    const root = document.documentElement;
    const set = () => root.style.setProperty("--toast-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--toast-h");
    };
  }, [shown]);

  // Escape dismisses the toast, unless something above it (a card, the menu, the Library
  // list) is open: Escape closes that first.
  useEffect(() => {
    if (shown === undefined) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      if (document.querySelector(".atl .peek, .atl .sh-sheet, .atl .sh-libmenu")) return;
      dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown, dismiss]);

  return (
    <Ctx.Provider value={show}>
      <DismissCtx.Provider value={dismiss}>
        {children}
        <div className="toast-dock" aria-live="polite">
          <AnimatePresence>
            {msg && (
              <motion.div
                key={msg.key}
                ref={box}
                className={`toast ${msg.tone === "tension" ? "tension" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                onPointerEnter={() => {
                  hold.current.pointer = true;
                  pause();
                }}
                onPointerLeave={() => {
                  hold.current.pointer = false;
                  resume();
                }}
                onFocus={() => {
                  hold.current.focus = true;
                  pause();
                }}
                onBlur={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                  hold.current.focus = false;
                  resume();
                }}
              >
                <span className="toast-text">{msg.text}</span>
                {msg.action && (
                  <button
                    type="button"
                    className="toast-act"
                    onClick={() => {
                      // Clear first, so a toast the action itself raises survives.
                      const act = msg.action!.run;
                      stop();
                      setMsg(null);
                      act();
                    }}
                  >
                    {msg.action.label}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DismissCtx.Provider>
    </Ctx.Provider>
  );
}
