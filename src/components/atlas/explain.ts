/* "Why?": plain-language explanations of computed statuses.

   Every status on the page is computed from the reader's own calls, so each
   one can be explained in a sentence that points at the move it turns on.
   The status word sits right beside the explanation, so the text doesn't
   repeat it (except in a contradiction, which has to name both sides). Explanations describe the present state only and never preview
   what a future call would do (consequences come after a call, not before). */

import type { DisputationIndex, Judgments, Labelling } from "./semantics";
import type { Label, Objection } from "./types";

export interface Explanation {
  /** The status being explained ("call" = the reader made a call on it directly). */
  tone: Label | "call";
  /** One or two plain sentences. */
  text: string;
  /** The move this status turns on, if any. */
  link?: { id: string; label: string };
}

type Plain = (s: string) => string;

const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const num = (n: number) => NUM[n] ?? String(n);

/** Quote a claim the way the page quotes claims: “…”. (Labels often contain ‘…’ themselves.) */
export function q(s: string): string {
  return `“${s}”`;
}

/** The label a node would carry from its replies alone (ignoring any call on it). */
export function labelFromReplies(kids: Label[]): Label {
  if (kids.length === 0) return "undec";
  if (kids.includes("in")) return "out";
  if (kids.every((k) => k === "out")) return "in";
  return "undec";
}

/** Why every reply to a move is out, told truthfully: a reply the reader said fails
    hasn't been answered by anyone. "both replies to it have been answered" /
    "you said both replies to it fail" / "you said one reply to it fails and the other has been answered". */
function allOut(kids: string[], j: Judgments): string {
  const n = kids.length;
  const failed = kids.filter((k) => j[k] === "fails").length;
  if (failed === 0) {
    if (n === 1) return "its one reply has been answered";
    if (n === 2) return "both replies to it have been answered";
    return `all ${num(n)} replies to it have been answered`;
  }
  if (failed === n) {
    if (n === 1) return "you said its one reply fails";
    if (n === 2) return "you said both replies to it fail";
    return `you said all ${num(n)} replies to it fail`;
  }
  const rest = n - failed;
  const said = n === 2 ? "one reply to it fails" : `${num(failed)} of its ${num(n)} replies ${failed === 1 ? "fails" : "fail"}`;
  const others = rest === 1 ? "the other has been answered" : `the other ${num(rest)} have been answered`;
  return `you said ${said} and ${others}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Why one move carries the status it does. */
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
    if (call === "holds" && standing.length) {
      return {
        tone: "call",
        text: `You said it holds, but ${q(name(standing[0]))} replies to it and stands, and a move with a standing reply is answered. These two contradict each other.`,
        link: { id: standing[0], label: name(standing[0]) },
      };
    }
    if (kids.length === 0) {
      return { tone: "call", text: "Nobody here has replied to it, so your call decides it." };
    }
    if (fromReplies === "out" && standing.length) {
      // Only reachable with call === "fails": the replies alone give the same result.
      return {
        tone: "call",
        text: `Without your call it would still be answered, because ${q(name(standing[0]))} replies to it and stands.`,
        link: { id: standing[0], label: name(standing[0]) },
      };
    }
    if (fromReplies === "in") {
      return {
        tone: "call",
        text: `Without your call it would ${call === "holds" ? "still stand" : "stand"}, because ${allOut(kids, j)}.`,
      };
    }
    const first = open[0];
    return {
      tone: "call",
      text: first ? `Without your call it would be open, because ${q(name(first))}, a reply to it, is still open.` : "Without your call it would be open.",
      link: first ? { id: first, label: name(first) } : undefined,
    };
  }

  const l = lab(id);
  if (l === "out") {
    const by = standing.find((c) => j[c] === "holds") ?? standing[0];
    return {
      tone: "out",
      text: by ? `${q(name(by))} replies to it and stands.` : "A reply to it stands.",
      link: by ? { id: by, label: name(by) } : undefined,
    };
  }
  if (l === "in") {
    return { tone: "in", text: `${cap(allOut(kids, j))}.` };
  }
  if (kids.length === 0) {
    return { tone: "undec", text: "Nobody here has replied to it, and you haven’t made a call on it." };
  }
  const first = open[0];
  if (!first) return { tone: "undec", text: "None of its replies has been settled yet." };
  const more = open.length - 1;
  return {
    tone: "undec",
    text: more > 0 ? `${q(name(first))} and ${num(more)} other ${more === 1 ? "reply" : "replies"} to it are still open.` : `${q(name(first))} replies to it and is still open.`,
    link: { id: first, label: name(first) },
  };
}

/** Why an objection (one to three parts) carries the status it does. */
export function explainObjection(labels: Labelling, o: Objection, toPlain: Plain, j: Judgments = {}): Explanation {
  const lab = (x: string): Label => labels.node.get(x) ?? "undec";
  const l = labels.objection.get(o.id) ?? "undec";
  const part = (id: string) => o.prongs.findIndex((p) => p.id === id) + 1;
  const n = o.prongs.length;
  const many = n > 1;
  if (l === "in") {
    const p = o.prongs.find((x) => j[x.id] === "holds" && lab(x.id) === "in") ?? o.prongs.find((x) => lab(x.id) === "in")!;
    const said = j[p.id] === "holds";
    const what = many ? `part ${part(p.id)}, ${q(toPlain(p.label))},` : `its argument, ${q(toPlain(p.label))},`;
    return {
      tone: "in",
      text: `${said ? `You said ${what} holds.` : `${cap(what)} stands.`}${many ? " The Objector needs only one part to stand." : ""}`,
      link: { id: p.id, label: toPlain(p.label) },
    };
  }
  if (l === "out") {
    if (many) return { tone: "out", text: n === 2 ? "Neither of its two parts stands." : `None of its ${num(n)} parts stands.` };
    const p = o.prongs[0];
    return {
      tone: "out",
      text: j[p.id] === "fails" ? `You said its argument, ${q(toPlain(p.label))}, fails.` : `Its argument, ${q(toPlain(p.label))}, has been answered.`,
      link: { id: p.id, label: toPlain(p.label) },
    };
  }
  const open = o.prongs.filter((x) => lab(x.id) === "undec");
  const first = open[0];
  if (!first) return { tone: "undec", text: "Nothing has been settled yet." };
  return {
    tone: "undec",
    text: many
      ? open.length === n
        ? `${n === 2 ? "Both parts are" : `All ${num(n)} parts are`} still open.`
        : `No part stands yet, and ${open.length === 1 ? `part ${part(first.id)} is` : `${num(open.length)} of the ${num(n)} parts are`} still open.`
      : `Its argument, ${q(toPlain(first.label))}, is still open.`,
    link: { id: first.id, label: toPlain(first.label) },
  };
}
