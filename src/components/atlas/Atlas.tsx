"use client";

/* Top-level shell for a Disputation: providers + the view for the current route. */

import "./atlas.css";
import { AtlasProvider, useAtlas } from "./context";
import { PeekProvider } from "./peek";
import { ToastProvider } from "./toast";
import type { Disputation } from "./types";
import defaultDisputation from "./content";
import Shell from "./views/Shell";
import Overview from "./views/Overview";
import Chamber from "./views/Chamber";
import Walk from "./views/Walk";
import Timeline from "./views/Timeline";
import Cast from "./views/Cast";
import Lexicon from "./views/Lexicon";
import Ledger from "./views/Ledger";
import Outline from "./views/Outline";
import Sources from "./views/Sources";
import Play from "./views/Play";

function CurrentView() {
  const { route } = useAtlas();
  switch (route.view) {
    case "home":
      return <Overview />;
    case "objection":
      return <Chamber key={route.o} o={route.o} node={route.node} />;
    case "walk":
      return <Walk key={route.o} o={route.o} />;
    case "timeline":
      return <Timeline moment={route.moment} />;
    case "cast":
      return <Cast thinker={route.thinker} />;
    case "lexicon":
      return <Lexicon term={route.term} />;
    case "ledger":
      return <Ledger />;
    case "outline":
      return <Outline />;
    case "sources":
      return <Sources />;
    case "play":
      return <Play />;
  }
}

export default function Atlas({ d = defaultDisputation }: { d?: Disputation }) {
  return (
    <div className="atl">
      <AtlasProvider d={d}>
        <ToastProvider>
          <PeekProvider>
            <Shell>
              <CurrentView />
            </Shell>
          </PeekProvider>
        </ToastProvider>
      </AtlasProvider>
    </div>
  );
}
