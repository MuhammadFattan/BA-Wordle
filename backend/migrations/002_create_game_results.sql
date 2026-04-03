CREATE TABLE IF NOT EXISTS game_results (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_index   INTEGER NOT NULL,
  win         BOOLEAN NOT NULL,
  guesses     INTEGER,
  played_at   DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, day_index)
);