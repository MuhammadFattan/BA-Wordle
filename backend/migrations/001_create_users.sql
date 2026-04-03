CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  google_id   VARCHAR(255) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255),
  avatar      VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);