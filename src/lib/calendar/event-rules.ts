/**
 * Keyword rules that auto-assign points and a default member to Google events
 * on first ingest. Only applied when the event row has no override yet — the
 * upsert preserves our local fields on re-sync (see google-sync.ts).
 *
 * Edit this file to add new rules. When it outgrows a dozen entries, move to
 * a DB-backed config with a UI in /calendar/admin.
 */

export interface EventRule {
  /** Regex matched against event title (case-insensitive via /i). */
  match: RegExp;
  /** Family member name, matched case-insensitively. null = unassigned (all). */
  assignedTo: string | null;
  /** Points awarded on completion. 0 = no points. */
  points: number;
}

export const EVENT_RULES: EventRule[] = [
  { match: /\bTKD\b|taekwondo/i, assignedTo: "Emmett", points: 5 },
  { match: /drama club|theater|theatre/i, assignedTo: "Emmett", points: 5 },
  { match: /soccer/i, assignedTo: "Sapphire", points: 5 },
];

export interface RuleMatch {
  assignedToName: string | null;
  points: number;
}

export function matchEventRule(title: string): RuleMatch | null {
  for (const rule of EVENT_RULES) {
    if (rule.match.test(title)) {
      return { assignedToName: rule.assignedTo, points: rule.points };
    }
  }
  return null;
}
