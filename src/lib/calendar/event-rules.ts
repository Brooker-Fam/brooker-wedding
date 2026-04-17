/**
 * Keyword rules that auto-assign points and a default member to Google events
 * on first ingest. Only applied when the event row has no override yet — the
 * upsert preserves our local fields on re-sync (see google-sync.ts).
 *
 * Edit this file to add new rules. When it outgrows a dozen entries, move to
 * a DB-backed config with a UI in /calendar/admin.
 */

import type { CalendarEventWithMember, FamilyMember } from "./types";

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

export interface MemberNamePattern {
  member: FamilyMember;
  re: RegExp;
}

/**
 * Precompile regexes once per sync run. Word boundary so "Matt" doesn't match
 * "Matthew"; metacharacters escaped in case a name ever contains them.
 */
export function compileMemberNamePatterns(
  members: FamilyMember[]
): MemberNamePattern[] {
  return members
    .filter((m) => !!m.name)
    .map((m) => {
      const escaped = m.name
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return { member: m, re: new RegExp(`\\b${escaped}\\b`) };
    });
}

export function matchMemberByName(
  title: string,
  patterns: MemberNamePattern[]
): FamilyMember | null {
  const lower = title.toLowerCase();
  for (const p of patterns) {
    if (p.re.test(lower)) return p.member;
  }
  return null;
}

/**
 * Shared source of truth for event completion status. Parent and EventCard
 * both use this so UI + action logic can't drift.
 */
export function isEventCompleted(event: CalendarEventWithMember): boolean {
  if (event.assigned_to != null) {
    return event.completions.some((c) => c.completed_by === event.assigned_to);
  }
  return event.completions.length > 0;
}

