"use client";

/* Top-level shell for a Disputation: providers + the view for the current route.

   Only the overview (server-rendered) and the chamber (where most deep links land)
   ship in the first chunk; every other view loads on demand and is warmed in the
   background once the page is idle. Once a view's code is in, the view renders on
   the spot, with no placeholder in between. A lazy view lifts the deep-link veil
   itself when it mounts (see Shell), so a slow phone never shows a blank or a flash
   of the overview in its place. */

import "./atlas.css";
import { MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { Component, useEffect, useLayoutEffect, useState, type ComponentType, type ErrorInfo, type ReactNode } from "react";
import { AtlasProvider, useAtlas } from "./context";
import { PeekProvider } from "./peek";
import { ToastProvider } from "./toast";
import type { Disputation } from "./types";
import defaultDisputation from "./content";
import { viewKey, type Route } from "./router";
import Shell from "./views/Shell";
import Overview from "./views/Overview";
import Chamber from "./views/Chamber";

/** Shown in place of a view whose code is still loading. Tall, so the footer stays below the fold. */
function Pending() {
  return <div className="sh-pending" data-atl-pending="" aria-busy="true" />;
}

/** Around a lazily loaded view: once it has mounted, the deep-link veil comes off and, if the
    view's heading wasn't there yet when the Shell moved focus, focus moves to it now. */
function Settled({ children }: { children: ReactNode }) {
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
  return children;
}

/** A view whose code loads on demand. `preload` fetches it once (the idle warm-up, a press on a
    link to it and the view itself share that one fetch); from then on the view renders at once.
    Until then it goes through next/dynamic, whose React.lazy suspends on its first render even
    when the code has already arrived, and React then holds the reveal until 300ms after the
    placeholder appeared: a blank page on every first visit, with the entrance spent on it. */
function lazyView<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  let loaded: ComponentType<P> | null = null;
  let loading: Promise<ComponentType<P>> | null = null;
  const preload = () => {
    if (!loading) {
      // One quiet retry: a chunk that failed once (a dropped connection on a phone) gets a
      // second chance, and a failure isn't kept, so the next attempt starts afresh.
      const p = load()
        .catch(() => new Promise<void>((r) => setTimeout(r, 1200)).then(load))
        .then((m) => (loaded = m.default));
      loading = p;
      p.catch(() => {
        if (loading === p) loading = null;
      });
    }
    return loading;
  };
  const Later = dynamic(
    () =>
      preload().then((View) => ({
        default: function Arrived(props: P) {
          return (
            <Settled>
              <View {...props} />
            </Settled>
          );
        },
      })),
    { ssr: false, loading: Pending },
  );
  function LazyView(props: P) {
    // Decided once per mount, so a view that started on the placeholder never remounts.
    const [View] = useState(() => loaded);
    if (!View) return <Later {...props} />;
    return (
      <Settled>
        <View {...props} />
      </Settled>
    );
  }
  return { View: LazyView, preload, ready: () => loaded !== null };
}

const lazy = {
  walk: lazyView(() => import("./views/Walk")),
  timeline: lazyView(() => import("./views/Timeline")),
  cast: lazyView(() => import("./views/Cast")),
  lexicon: lazyView(() => import("./views/Lexicon")),
  ledger: lazyView(() => import("./views/Ledger")),
  outline: lazyView(() => import("./views/Outline")),
  sources: lazyView(() => import("./views/Sources")),
  play: lazyView(() => import("./views/Play")),
};

const Walk = lazy.walk.View;
const Timeline = lazy.timeline.View;
const Cast = lazy.cast.View;
const Lexicon = lazy.lexicon.View;
const Ledger = lazy.ledger.View;
const Outline = lazy.outline.View;
const Sources = lazy.sources.View;
const Play = lazy.play.View;

/** Start fetching a route's view code if it isn't in yet: the fetch to wait on, or null when
    there is nothing to wait for (the overview and the chamber ship in the first chunk). */
function warmRoute(r: Route): Promise<unknown> | null {
  const v = r.view in lazy ? lazy[r.view as keyof typeof lazy] : null;
  return v && !v.ready() ? v.preload() : null;
}

/** Fetch the other views' code once the page has settled: after a deep link's own view is on
    screen (so the warm-up never competes with it for a slow phone's bandwidth), when idle. */
function useWarmViews() {
  useEffect(() => {
    type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const w = window as IdleWindow;
    const root = document.documentElement;
    let idle = 0;
    let timer = 0;
    const warm = () => Object.values(lazy).forEach((v) => void v.preload().catch(() => {}));
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
    case "play":
      view = <Play />;
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
              <Shell warm={warmRoute}>
                <CurrentView />
              </Shell>
            </PeekProvider>
          </ToastProvider>
        </AtlasProvider>
      </MotionConfig>
    </div>
  );
}
