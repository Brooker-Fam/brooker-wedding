export type MemberRole = "adult" | "kid";
export type TaskSource = "manual" | "google" | "alexa" | "mcp";
export type TaskStatus = "pending" | "completed" | "skipped";
export type TaskPriority = "low" | "medium" | "high";

export interface Household {
  id: number;
  name: string;
  created_at: string;
}

export interface FamilyMember {
  id: number;
  household_id: number;
  name: string;
  role: MemberRole;
  color: string;
  avatar_emoji: string | null;
  sort_order: number;
  created_at: string;
}

export interface Task {
  id: number;
  household_id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  source: TaskSource;
  status: TaskStatus;
  priority: TaskPriority;
  points: number;
  due_date: string | null;
  due_time: string | null;
  duration_minutes: number | null;
  recurrence_rule: string | null;
  google_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCompletion {
  id: number;
  task_id: number;
  completed_by: number;
  completed_date: string;
  points_earned: number;
  photo_url: string | null;
  notes: string | null;
  verified_by: number | null;
  verified_at: string | null;
  created_at: string;
}

export interface TaskWithMember extends Task {
  member_name: string | null;
  member_color: string | null;
  member_emoji: string | null;
}

export interface TaskWithCompletion extends TaskWithMember {
  completion_id: number | null;
  completed_date: string | null;
  completed_by_name: string | null;
}

export interface ScoreboardEntry {
  member_id: number;
  name: string;
  emoji: string | null;
  color: string;
  week_points: number;
  month_points: number;
  all_time_points: number;
  completed_count: number;
}

// ── Google Calendar integration ──────────────────────────────────────

export type EventStatus = "confirmed" | "tentative" | "cancelled";

export interface GoogleCalendar {
  id: number;
  household_id: number;
  google_calendar_id: string;
  summary: string;
  color: string | null;
  enabled: boolean;
  assigned_to: number | null;
  sync_token: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  household_id: number;
  google_calendar_id: string;
  google_event_id: string;
  ical_uid: string | null;
  etag: string | null;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string;
  all_day: boolean;
  timezone: string | null;
  recurrence_rule: string | null;
  recurring_event_id: string | null;
  original_start_at: string | null;
  assigned_to: number | null;
  color_override: string | null;
  points: number;
  auto_award: boolean;
  status: EventStatus;
  html_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventCompletion {
  id: number;
  event_id: number;
  completed_by: number;
  completed_date: string;
  points_earned: number;
  notes: string | null;
  created_at: string;
}

export interface CalendarEventWithMember extends CalendarEvent {
  member_name: string | null;
  member_color: string | null;
  member_emoji: string | null;
  calendar_summary: string | null;
  completions: Array<{
    id: number;
    completed_by: number;
    completed_by_name: string;
    points_earned: number;
  }>;
}
