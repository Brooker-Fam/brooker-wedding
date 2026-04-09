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
