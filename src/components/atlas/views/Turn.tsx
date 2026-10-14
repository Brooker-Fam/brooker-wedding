"use client";

/* One move in the thread, read as a line in a script.
   Collapsed: cue, address, glyph + claim, the gist, and its status.
   Focused (expanded in place): the plain-terms line, the side's full case,
   its quotation (with a link to the text where there is one), its sources,
   people, glossary terms and cross-links, then the decision
   block (what would change this side's mind, Holds / Fails / Read the reply,
   and a Why? that explains the computed status in a sentence). */

import { useId, useMemo, type ReactNode } from "react";
import { useAtlas } from "../context";
import { explainNode } from "../explain";
import { address } from "../helpers";
import { parseMarkup } from "../markup";
import { usePeek } from "../peek";
import { Glyph, RichText, ThinkerChip } from "../primitives";
import { formatRoute } from "../router";
import { ContextLink } from "./OutlineList";
import { SourceList } from "./Sources";
import { CallButtons, MoveChip, SIDE_POSS, SIDE_WORD, TurnStatus, WhyLine, cueFor, moveNoun, q, rippleStyle, seatOf, spellAddress, useChamber } from "./chamberShared";

const KEYS = "ArrowUp ArrowDown ArrowLeft ArrowRight h f";

/** First occurrence wins: a list of {id, …} with each id once. */
function uniqueBy<T>(xs: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  return xs.filter((x) => {
    const k = key(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function Section({ title, count, className = "", children }: { title: string; count?: number; className?: string; children: ReactNode }) {
  return (
    <section className={`ch-sec ${className}`}>
      <h4 className="ch-sec-h mono">
        {title}
        {count !== undefined && <span className="ch-sec-n"> · {count}</span>}
      </h4>
      {children}
    </section>
  );
}

/* ---------------- the turn ---------------- */

export interface TurnProps {
  id: string;
  focused: boolean;
  /** The next move on the branch path, if any (for "Read the reply"). */
  next?: string;
  /** Part of a tension pair adjacent on the path. */
  tensed?: boolean;
}

export default function Turn({ id, focused, next, tensed = false }: TurnProps) {
  const { ix, labels, judgments, labelOf, toPlain, termName, tensions } = useAtlas();
  const api = useChamber();
  const peek = usePeek();
  const info = ix.nodes.get(id);
  const hid = useId();

  // Terms used in this move: the lexicon's name if it has one, else the words the text itself shows.
  const terms = useMemo(() => {
    if (!info) return [] as { id: string; name: string }[];
    const n = info.node;
    const out = new Map<string, string>();
    for (const t of [n.gist, ...n.body, n.cedes ?? ""])
      for (const tok of parseMarkup(t)) if (tok.t === "term" && !out.has(tok.id)) out.set(tok.id, ix.terms.get(tok.id)?.term ?? tok.v ?? termName(tok.id));
    return [...out].map(([tid, name]) => ({ id: tid, name }));
  }, [info, ix, termName]);

  const people = useMemo(() => {
    if (!info) return [] as string[];
    const n = info.node;
    const out = new Set<string>(n.thinkers ?? []);
    for (const t of [n.gist, ...n.body, n.cedes ?? ""]) for (const tok of parseMarkup(t)) if (tok.t === "thinker") out.add(tok.id);
    return [...out].filter((t) => ix.thinkers.has(t));
  }, [info, ix]);

  if (!info) return null;
  const n = info.node;
  const side = n.side;
  const seat = seatOf(side);
  const l = labelOf(id);
  const call = judgments[id];
  const cue = cueFor(info.depth, side);
  const addr = address(ix, id);
  const addrLong = spellAddress(ix, id);
  const rippled = api.ripple?.changed.has(id);
  const style = rippleStyle(api.ripple, info.depth);
  const cls = `ch-turn s-${side} seat-${seat} st-${l} ${focused ? "is-focus" : "is-folded"} ${call ? "has-call" : ""} ${tensed ? "is-tensed" : ""}`;
  // If a cue ever stops naming the speaker, name them beside the address.
  const sideInCue = /Objector|Defender|Spinoza/.test(cue);

  if (!focused) {
    return (
      <article className={cls} style={style} data-node-id={id} data-turn={id} aria-labelledby={hid}>
        {rippled && <span key={api.ripple!.key} className="ch-ripple" aria-hidden />}
        <div className="ch-cue">
          <span className="ch-cue-k">{cue}</span>
          <span className="ch-addr" title={addrLong}>
            {addr}
            {!sideInCue && <span className="ch-addr-side"> · {SIDE_WORD[side]}</span>}
          </span>
        </div>
        <h3 className="ch-label" id={hid}>
          <button type="button" className="ch-hit" aria-keyshortcuts={KEYS} onClick={() => api.focus(id, "thread")}>
            <Glyph side={side} label={l} size={13} className="ch-label-glyph" />
            <span className={l === "out" ? "lab-out" : "lab-in"}>{toPlain(n.label)}</span>
          </button>
        </h3>
        {n.gist && <p className="ch-gist-fold">{toPlain(n.gist)}</p>}
        <div className="ch-foot">
          <TurnStatus id={id} side={side} label={l} call={call} />
          {info.childIds.length > 0 && <span className="ch-replies mono">{info.childIds.length === 1 ? "1 reply" : `${info.childIds.length} replies`}</span>}
        </div>
      </article>
    );
  }

  const explanation = explainNode(ix, labels, judgments, id, toPlain);
  const see = uniqueBy(
    (n.see ?? []).filter((s) => ix.nodes.has(s.id) && s.id !== id),
    (s) => s.id,
  );
  // A move this one already links to under "See also" isn't listed again under "Linked from".
  const seeIds = new Set(see.map((s) => s.id));
  const backlinks = uniqueBy(ix.backlinks.get(id) ?? [], (b) => b.from).filter((b) => b.from !== id && !seeIds.has(b.from));
  const offPathTensions = tensions.filter((t) => t.node === id && t.reply !== next);
  const body = n.body.filter((p) => p.trim());
  const sources = (n.sources ?? []).filter((s) => s.title);
  const parentInfo = info.parent ? ix.nodes.get(info.parent) : undefined;

  return (
    <article className={cls} style={style} data-node-id={id} data-turn={id} aria-labelledby={hid}>
      {rippled && <span key={api.ripple!.key} className="ch-ripple" aria-hidden />}
      <div className="ch-cue">
        <span className="ch-cue-k">{cue}</span>
        <span className="ch-addr" title={addrLong}>
          <span className="ch-round">Round {info.depth} · </span>
          {addr}
        </span>
      </div>
      <h3 className="ch-label ch-label-big" id={hid} tabIndex={-1} data-turn-heading={id} aria-keyshortcuts={KEYS}>
        <Glyph side={side} label={l} size={15} className="ch-label-glyph" />
        <span className={l === "out" ? "lab-out" : "lab-in"}>{toPlain(n.label)}</span>
      </h3>
      {/* The cue above already names the speaker; this line says what the move replies to. */}
      {info.parent && parentInfo && (
        <p className="ch-side-line">
          <span className="ch-answers">
            replying to {SIDE_POSS[parentInfo.node.side]} {moveNoun(parentInfo.depth)},{" "}
            <button
              type="button"
              className="ch-answers-link"
              title={spellAddress(ix, info.parent)}
              aria-label={`${address(ix, info.parent)}: ${toPlain(parentInfo.node.label)}`}
              onClick={() => api.focus(info.parent!, "thread")}
            >
              {address(ix, info.parent)}
            </button>
          </span>
        </p>
      )}

      {n.gist && (
        <div className="ch-plain">
          <span className="ch-plain-k mono">In plain terms</span>
          <p className="ch-plain-t">
            <RichText text={n.gist} onNode={api.jump} />
          </p>
        </div>
      )}

      {body.length > 0 && (
        <div className="ch-body">
          {body.map((p, i) => (
            <p key={i}>
              <RichText text={p} onNode={api.jump} />
            </p>
          ))}
        </div>
      )}

      {n.quote && n.quote.text && (
        <figure className="ch-quote">
          <blockquote>
            <p>{n.quote.text}</p>
          </blockquote>
          {(n.quote.who || n.quote.cite || n.quote.url) && (
            <figcaption>
              {n.quote.who && <span className="ch-quote-who">{n.quote.who}</span>}
              {n.quote.cite && <span className="ch-quote-cite">{n.quote.cite}</span>}
              <ContextLink url={n.quote.url} />
            </figcaption>
          )}
        </figure>
      )}

      {/* Right under the case and its quotation, so the texts behind the move are easy to find. */}
      {sources.length > 0 && (
        <Section title="Sources" count={sources.length} className="ch-srcs">
          <SourceList sources={sources} className="ch-srclist" />
          <a className="ch-allsrc" href={formatRoute({ view: "sources" })}>
            <span className="ch-u">See all sources</span> <span aria-hidden>→</span>
          </a>
        </Section>
      )}

      {(people.length > 0 || terms.length > 0) && (
        <div className="ch-refs">
          {people.length > 0 && (
            <Section title="People">
              <div className="ch-chips">
                {people.map((t) => (
                  <ThinkerChip key={t} id={t} />
                ))}
              </div>
            </Section>
          )}
          {terms.length > 0 && (
            <Section title="Glossary">
              <div className="ch-chips">
                {terms.map((t) => (
                  <button key={t.id} type="button" className="chip ch-term" onClick={(e) => peek({ kind: "term", id: t.id, rect: e.currentTarget.getBoundingClientRect() })}>
                    <span className="ch-term-mark" aria-hidden>
                      ¶
                    </span>
                    {t.name}
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {(see.length > 0 || backlinks.length > 0) && (
        <div className="ch-links">
          {see.length > 0 && (
            <Section title="See also">
              <ul className="ch-xrefs">
                {see.map((s) => (
                  <MoveChip key={s.id} id={s.id} why={s.why} onGo={api.jump} />
                ))}
              </ul>
            </Section>
          )}
          {backlinks.length > 0 && (
            <Section title="Linked from">
              <ul className="ch-xrefs">
                {backlinks.map((b) => (
                  <MoveChip key={b.from} id={b.from} why={b.why} onGo={api.jump} />
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      <div className="ch-decide">
        {n.cedes && (
          <div className="ch-cedes">
            <span className="ch-cedes-k mono">What would change this side’s mind</span>
            <p className="ch-cedes-t">
              <RichText text={n.cedes} onNode={api.jump} />
            </p>
          </div>
        )}
        <div className="ch-decide-row">
          <CallButtons id={id} side={side} call={call} />
          {next && (
            <button type="button" className="btn ch-hear" onClick={() => api.focus(next, "thread")}>
              {info.childIds.length > 1 ? "Read the replies" : "Read the reply"} <span aria-hidden>↓</span>
            </button>
          )}
        </div>
        <div className="ch-decide-status">
          <TurnStatus id={id} side={side} label={l} call={call} />
          <WhyLine key={`${id}:${l}:${call ?? ""}`} explanation={explanation} onGo={(x) => api.focus(x, "link")} />
        </div>
        {offPathTensions.map((t) => (
          <div key={t.reply} className="tension-note ch-tension-inline" role="note">
            <p>
              You said this holds, but {q(toPlain(ix.nodes.get(t.reply)?.node.label ?? t.reply))}, a reply to it, stands, and a move with a standing reply is answered. These two
              contradict each other.
            </p>
            <div className="ch-tension-acts">
              <button type="button" className="btn small" onClick={() => api.decide(id, null)}>
                Clear this call
              </button>
              {judgments[t.reply] ? (
                <button type="button" className="btn small" onClick={() => api.decide(t.reply, null)}>
                  Clear that call
                </button>
              ) : (
                <button type="button" className="btn small" onClick={() => api.focus(t.reply, "link")}>
                  Go to that reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
