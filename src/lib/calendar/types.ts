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
