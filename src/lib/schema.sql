CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  guest_count INTEGER DEFAULT 1,
  attending BOOLEAN DEFAULT true,
  dietary_restrictions TEXT,
  potluck_dish TEXT,
  message TEXT,
  phone VARCHAR(20),
  mailing_address TEXT,
  attendee_names TEXT,
  adult_count INTEGER DEFAULT 1,
  child_count INTEGER DEFAULT 0,
  public_display BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_scores_game_id ON game_scores(game_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(game_id, score DESC);

CREATE TABLE IF NOT EXISTS mailing_lists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mailing_list_entries (
  id SERIAL PRIMARY KEY,
  list_id INTEGER NOT NULL REFERENCES mailing_lists(id) ON DELETE CASCADE,
  rsvp_id INTEGER NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
  addressee TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (list_id, rsvp_id)
);

CREATE INDEX IF NOT EXISTS idx_mailing_list_entries_list ON mailing_list_entries(list_id);
CREATE INDEX IF NOT EXISTS idx_mailing_list_entries_rsvp ON mailing_list_entries(rsvp_id);

CREATE TABLE IF NOT EXISTS song_requests (
  id SERIAL PRIMARY KEY,
  requester_name VARCHAR(255) NOT NULL,
  song_title VARCHAR(500) NOT NULL,
  artist VARCHAR(500) NOT NULL,
  album_art_url TEXT,
  preview_url TEXT,
  itunes_url TEXT,
  itunes_track_id BIGINT UNIQUE,
  songlink_url TEXT,
  pinned BOOLEAN DEFAULT false,
  sort_position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS song_votes (
  id SERIAL PRIMARY KEY,
  song_request_id INTEGER NOT NULL REFERENCES song_requests(id) ON DELETE CASCADE,
  voter_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(song_request_id, voter_name)
);

CREATE INDEX IF NOT EXISTS idx_song_requests_track_id ON song_requests(itunes_track_id);
CREATE INDEX IF NOT EXISTS idx_song_votes_song_id ON song_votes(song_request_id);

CREATE TABLE IF NOT EXISTS spotify_config (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- FAMILY CALENDAR
-- ========================================

CREATE TABLE IF NOT EXISTS households (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'adult',  -- 'adult' | 'kid'
  color VARCHAR(7) NOT NULL,                  -- hex e.g. '#4A90D9'
  avatar_emoji VARCHAR(10),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_family_members_household ON family_members(household_id);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  assigned_to INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'manual',   -- 'manual' | 'google' | 'alexa' | 'mcp'
  status VARCHAR(20) NOT NULL DEFAULT 'pending',   -- 'pending' | 'completed' | 'skipped'
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',  -- 'low' | 'medium' | 'high'
  points INTEGER NOT NULL DEFAULT 0,
  due_date DATE,
  due_time TIME,
  duration_minutes INTEGER,
  recurrence_rule TEXT,                            -- iCal RRULE format
  google_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_household_due ON tasks(household_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_google_event ON tasks(google_event_id) WHERE google_event_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS task_completions (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_by INTEGER NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  photo_url TEXT,
  notes TEXT,
  verified_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_completions_task ON task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON task_completions(completed_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_completions_task_date ON task_completions(task_id, completed_date);
