/* "Why?" — plain-language explanations of computed statuses.

   Every status on the page is computed from the reader's own calls, so each
   one can be explained in a sentence that points at the move it turns on.
   Explanations describe the present state only; they never preview what a
   future call would do (consequences come after a call, not before). */

import type { DisputationIndex, Judgments, Labelling } from "./semantics";
import type { Label, Objection } from "./types";

export interface Explanation {
  /** The status being explained ("call" = the reader ruled on it directly). */
  tone: Label | "call";
  /** One or two plain sentences. */
  text: string;
  /** The move this status turns on, if any. */
  link?: { id: string; label: string };
}

type Plain = (s: string) => string;

const LEFT_TO_ITSELF: Record<Label, string> = {
  in: "standing — every reply to it is answered",
  out: "answered",
  undec: "open",
};

/** Quote a claim the way the page quotes claims: ‘…’. */
export function q(s: string): string {
  return `‘${s}’`;
}

/** The label a node would carry from its replies alone (ignoring any call on it). */
export function labelFromReplies(kids: Label[]): Label {
  if (kids.length === 0) return "undec";
  if (kids.includes("in")) return "out";
  if (kids.every((k) => k === "out")) return "in";
  return "undec";
}

/** Why one move carries the status it does, on the reader's calls. */
export function explainNode(ix: DisputationIndex, labels: Labelling, j: Judgments, id: string, toPlain: Plain): Explanation {
  const info = ix.nodes.get(id);
  if (!info) return { tone: "undec", text: "" };
  const lab = (x: string): Label => labels.node.get(x) ?? "undec";
  const name = (x: string) => toPlain(ix.nodes.get(x)?.node.label ?? x);
  const kids = info.childIds;
  const standing = kids.filter((c) => lab(c) === "in");
  const open = kids.filter((c) => lab(c) === "undec");
  const call = j[id];

  if (call) {
    const fromReplies = labelFromReplies(kids.map(lab));
    const said = call === "holds" ? "holds" : "fails";
    if (call === "holds" && standing.length) {
      return {
        tone: "call",
        text: `You said it holds — but ${q(name(standing[0]))} answers it and also stands on your calls. One of them has to give.`,
        link: { id: standing[0], label: name(standing[0]) },
      };
    }
    if (kids.length === 0) {
      return { tone: "call", text: `Your call: you said it ${said}. Nobody in the disputation answers it here, so your word settles it.` };
    }
    const reason =
      fromReplies === "out" && standing.length
        ? `${q(name(standing[0]))} stands`
        : fromReplies === "undec" && open.length
          ? `${q(name(open[0]))} is still undecided`
          : fromReplies === "in"
            ? "every reply to it is answered"
            : "";
    const agree = (fromReplies === "in" && call === "holds") || (fromReplies === "out" && call === "fails");
    return {
      tone: "call",
      text: agree
        ? `Your call: you said it ${said}, which agrees with its replies — ${reason}.`
        : `Your call: you said it ${said}. Left to its replies alone it would be ${LEFT_TO_ITSELF[fromReplies]}${fromReplies === "undec" && reason ? ` — ${reason}` : fromReplies === "out" && reason ? `, because ${reason}` : ""}.`,
      link:
        fromReplies === "out" && standing.length
          ? { id: standing[0], label: name(standing[0]) }
          : fromReplies === "undec" && open.length
            ? { id: open[0], label: name(open[0]) }
            : undefined,
    };
  }

  const l = lab(id);
  if (l === "out") {
    const by = standing.find((c) => j[c] === "holds") ?? standing[0];
    return {
      tone: "out",
      text: by ? `Answered on your calls, because ${q(name(by))} stands.` : "Answered on your calls.",
      link: by ? { id: by, label: name(by) } : undefined,
    };
  }
  if (l === "in") {
    return {
      tone: "in",
      text:
        kids.length === 1
          ? "Stands on your calls: the one reply to it is answered."
          : `Stands on your calls: every reply to it is answered${kids.length > 2 ? ` — all ${kids.length} of them` : ""}.`,
    };
  }
  if (kids.length === 0) {
    return { tone: "undec", text: "Open: nobody has answered it, and you haven’t called it." };
  }
  const first = open[0];
  if (!first) return { tone: "undec", text: "Open." };
  const more = open.length - 1;
  return {
    tone: "undec",
    text: more > 0 ? `Open: ${q(name(first))} and ${more} other ${more === 1 ? "reply" : "replies"} are still undecided.` : `Open: ${q(name(first))} is still undecided.`,
    link: { id: first, label: name(first) },
  };
}

/** Why an objection (a cluster of prongs) carries the status it does. */
export function explainObjection(labels: Labelling, o: Objection, toPlain: Plain): Explanation {
  const lab = (x: string): Label => labels.node.get(x) ?? "undec";
  const l = labels.objection.get(o.id) ?? "undec";
  const idx = (id: string) => o.prongs.findIndex((p) => p.id === id) + 1;
  const many = o.prongs.length > 1;
  if (l === "in") {
    const p = o.prongs.find((x) => lab(x.id) === "in")!;
    return {
      tone: "in",
      text: many
        ? `Stands on your calls, because objection ${idx(p.id)} — ${q(toPlain(p.label))} — stands. One is enough.`
        : `Stands on your calls, because ${q(toPlain(p.label))} stands.`,
      link: { id: p.id, label: toPlain(p.label) },
    };
  }
  if (l === "out") {
    return { tone: "out", text: many ? `Answered on your calls: all ${o.prongs.length} of its objections are answered.` : "Answered on your calls: its objection is answered." };
  }
  const open = o.prongs.filter((x) => lab(x.id) === "undec");
  const first = open[0];
  if (!first) return { tone: "undec", text: "Undecided." };
  return {
    tone: "undec",
    text: many
      ? `Undecided: nothing stands yet, and ${
          open.length === 1
            ? `objection ${idx(first.id)} is`
            : open.length === o.prongs.length
              ? `${open.length === 2 ? "both" : `all ${open.length}`} of its objections are`
              : `${open.length} of its ${o.prongs.length} objections are`
        } still open.`
      : "Undecided: its objection is still open.",
    link: { id: first.id, label: toPlain(first.label) },
  };
}
