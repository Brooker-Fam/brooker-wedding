import type { Metadata } from "next";
import Link from "next/link";
import "@/components/atlas/atlas.css";
import "@/components/atlas/views/library.css";
import disputation from "@/components/atlas/content";
import OutlineList from "@/components/atlas/views/OutlineList";

export const metadata: Metadata = {
  title: "All the Way Down · Outline",
  description:
    "Every objection and reply in All the Way Down as one plain outline, from the five objections to the Christian God through every round of the argument.",
};

const MAP = "/debates/all-the-way-down";

/* A static, server-rendered outline of the entire disputation: the no-JavaScript
   page, the version search engines index, and a printable reading copy. Each
   move links into the interactive map. */
export default function DisputationOutlinePage() {
  const d = disputation;
  return (
    <div className="atl ol-noscript">
      <div className="lib lib-outline">
        <p className="lib-notice ol-ns-note">
          Every move as a plain outline. <a href={`${MAP}#/`}>Open the interactive map →</a>
        </p>
        <header className="lib-head">
          <p className="eyebrow">Outline</p>
          <h1 className="lib-h1 display">{d.title}</h1>
          <p className="lib-dek">{d.subtitle}</p>
          {d.intro.map((p, i) => (
            <p key={i} className="lib-dek">
              {p}
            </p>
          ))}
        </header>
        <nav className="ol-bar ol-ns-toc" id="ns-contents" aria-label="Objections">
          <ol className="ol-toc">
            {d.objections.map((o) => (
              <li key={o.id}>
                <a className="ol-toc-btn" href={`#ns-${o.id}`} aria-label={`Objection ${o.numeral}: ${o.short || o.title}`}>
                  <span className="serif ol-toc-num">{o.numeral}</span>
                  <span className="ol-toc-word mono">{o.short || o.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <OutlineList
          d={d}
          idPrefix="ns-"
          nodeHref={(id, o) => `${MAP}#/o/${o}/${id}`}
          objectionHref={(o) => `${MAP}#/o/${o}`}
          sectionEnd={() => (
            <a className="ol-top mono" href="#ns-contents">
              ↑ All objections
            </a>
          )}
        />
        <p className="lib-notice" style={{ marginTop: 48 }}>
          <Link href="/debates">← All Thought Pages</Link> · <Link href="/">brooker.family</Link>
        </p>
      </div>
    </div>
  );
}
