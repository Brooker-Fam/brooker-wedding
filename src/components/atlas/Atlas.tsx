"use client";

/* Top-level shell for a Disputation: providers + the view for the current route.

   Only the overview (server-rendered) and the chamber (where most deep links land)
   ship in the first chunk; every other view loads on demand and is warmed in the
   background once the page is idle. A lazy view lifts the deep-link veil itself
   when it mounts (see Shell), so a slow phone never shows a blank or a flash of
   the overview in its place. */

import "./atlas.css";
import { MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { Component, useEffect, useLayoutEffect, type ComponentType, type ErrorInfo, type ReactNode } from "react";
import { AtlasProvider, useAtlas } from "./context";
import { PeekProvider } from "./peek";
import { ToastProvider } from "./toast";
import type { Disputation } from "./types";
import defaultDisputation from "./content";
import { viewKey } from "./router";
import Shell from "./views/Shell";
import Overview from "./views/Overview";
import Chamber from "./views/Chamber";

/** Shown in place of a view whose code is still loading. Tall, so the footer stays below the fold. */
function Pending() {
  return <div className="sh-pending" data-atl-pending="" aria-busy="true" />;
}

/** Wraps a lazily loaded view: once it has mounted, the deep-link veil comes off and, if the
    view's heading wasn't there yet when the Shell moved focus, focus moves to it now. */
function lazyView<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  // One quiet retry: React.lazy caches a rejection, so a chunk that failed once (a dropped
  // connection on a phone) would otherwise stay broken until a reload.
  const attempt = () => load().catch(() => new Promise<void>((r) => setTimeout(r, 1200)).then(load));
  return () =>
    attempt().then(({ default: View }) => {
      function Mounted(props: P) {
        useLayoutEffect(() => {
          document.documentElement.removeAttribute("data-atl-deep");
          // After a navigation the Shell focuses the view's h1, or the frame itself when the h1
          // wasn't there yet: in that case, finish the job now.
          const main = document.getElementById("atl-main");
          if (main && document.activeElement === main) {
            const h = main.querySelector<HTMLElement>("h1");
            if (h) {
              if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
              h.focus({ preventScroll: true });
            }
          }
        }, []);
        return <View {...props} />;
      }
      return { default: Mounted };
    });
}

const loaders = {
  walk: () => import("./views/Walk"),
  timeline: () => import("./views/Timeline"),
  cast: () => import("./views/Cast"),
  lexicon: () => import("./views/Lexicon"),
  ledger: () => import("./views/Ledger"),
  outline: () => import("./views/Outline"),
  sources: () => import("./views/Sources"),
};

const Walk = dynamic(lazyView(() => import("./views/Walk")), { ssr: false, loading: Pending });
const Timeline = dynamic(lazyView(() => import("./views/Timeline")), { ssr: false, loading: Pending });
const Cast = dynamic(lazyView(() => import("./views/Cast")), { ssr: false, loading: Pending });
const Lexicon = dynamic(lazyView(() => import("./views/Lexicon")), { ssr: false, loading: Pending });
const Ledger = dynamic(lazyView(() => import("./views/Ledger")), { ssr: false, loading: Pending });
const Outline = dynamic(lazyView(() => import("./views/Outline")), { ssr: false, loading: Pending });
const Sources = dynamic(lazyView(() => import("./views/Sources")), { ssr: false, loading: Pending });

/** Fetch the other views' code once the page has settled: after a deep link's own view is on
    screen (so the warm-up never competes with it for a slow phone's bandwidth), when idle. */
function useWarmViews() {
  useEffect(() => {
    type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const w = window as IdleWindow;
    const root = document.documentElement;
    let idle = 0;
    let timer = 0;
    const warm = () => Object.values(loaders).forEach((load) => void load().catch(() => {}));
    const schedule = () => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(warm, { timeout: 6000 });
      else timer = window.setTimeout(warm, 3000);
    };
    let mo: MutationObserver | null = null;
    if (root.hasAttribute("data-atl-deep")) {
      mo = new MutationObserver(() => {
        if (root.hasAttribute("data-atl-deep")) return;
        mo?.disconnect();
        mo = null;
        schedule();
      });
      mo.observe(root, { attributes: true, attributeFilter: ["data-atl-deep"] });
    } else schedule();
    return () => {
      mo?.disconnect();
      if (idle) w.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/* A view that throws leaves the top bar and footer standing            */
/* ------------------------------------------------------------------ */

/** A view's code that couldn't be fetched (webpack and Turbopack word it differently). */
function isChunkError(error: unknown): boolean {
  const e = error as { name?: string; message?: string } | null;
  return e?.name === "ChunkLoadError" || /loading (css )?chunk|failed to load chunk|dynamically imported module|importing a module script failed/i.test(e?.message ?? "");
}

class ViewBoundary extends Component<{ children: ReactNode; onHome: () => void }, { failed: boolean; chunk: boolean }> {
  state = { failed: false, chunk: false };
  static getDerivedStateFromError(error: unknown) {
    return { failed: true, chunk: isChunkError(error) };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[disputation] a view failed to render", error, info.componentStack);
    document.documentElement.removeAttribute("data-atl-deep");
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="sh-failed">
        <h1 className="sh-failed-h" tabIndex={-1}>
          Something went wrong on this page.
        </h1>
        <p className="sh-failed-p">
          {this.state.chunk
            ? "This part of the page didn’t finish loading, perhaps because the connection dropped. Your marks are kept."
            : "The rest of the disputation is fine. Your marks are kept."}
        </p>
        <div className="sh-failed-btns">
          {this.state.chunk && (
            <button type="button" className="btn solid" onClick={() => window.location.reload()}>
              Reload the page
            </button>
          )}
          <button type="button" className="btn" onClick={this.props.onHome}>
            Back to the map
          </button>
        </div>
      </div>
    );
  }
}

function CurrentView() {
  const { route, go } = useAtlas();
  let view: ReactNode;
  switch (route.view) {
    case "home":
      view = <Overview />;
      break;
    case "objection":
      view = <Chamber key={route.o} o={route.o} node={route.node} />;
      break;
    case "walk":
      view = <Walk key={route.o} o={route.o} />;
      break;
    case "timeline":
      view = <Timeline moment={route.moment} />;
      break;
    case "cast":
      view = <Cast thinker={route.thinker} />;
      break;
    case "lexicon":
      view = <Lexicon term={route.term} />;
      break;
    case "ledger":
      view = <Ledger />;
      break;
    case "outline":
      view = <Outline />;
      break;
    case "sources":
      view = <Sources />;
      break;
  }
  return (
    <ViewBoundary key={viewKey(route)} onHome={() => go({ view: "home" })}>
      {view}
    </ViewBoundary>
  );
}

export default function Atlas({ d = defaultDisputation }: { d?: Disputation }) {
  useWarmViews();
  return (
    <div className="atl">
      {/* Above the toast and peek providers too, so they honour reduced motion like the views. */}
      <MotionConfig reducedMotion="user">
        <AtlasProvider d={d}>
          <ToastProvider>
            <PeekProvider>
              <Shell>
                <CurrentView />
              </Shell>
            </PeekProvider>
          </ToastProvider>
        </AtlasProvider>
      </MotionConfig>
    </div>
  );
}
