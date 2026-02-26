CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  guest_count INTEGER DEFAULT 1,
  attending BOOLEAN DEFAULT true,
  dietary_restrictions TEXT,
  potluck_dish TEXT,
  message TEXT,
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
