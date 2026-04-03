const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const { updateStats, getStats, resetStats } = require("../data/stats");

async function calcUserStats(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM game_results
     WHERE user_id = $1
     ORDER BY day_index ASC`,
    [userId]
  );

  const played = rows.length;
  const wins = rows.filter((r) => r.win).length;

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  for (const row of rows) {
    if (row.win) {
      tempStreak += 1;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].win) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const guessDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  rows.forEach((r) => {
    if (r.win && r.guesses >= 1 && r.guesses <= 6) {
      guessDistribution[r.guesses] += 1;
    }
  });

  return {
    played,
    wins,
    currentStreak,
    maxStreak,
    guessDistribution,
    lastPlayed: rows.length ? rows[rows.length - 1].played_at : null,
  };
}

// GET /api/stats
router.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.json(getStats());
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET
    );

    const stats = await calcUserStats(decoded.id);
    res.json(stats);
  } catch {
    res.json(getStats());
  }
});

// POST /api/stats
router.post("/", async (req, res) => {
  const { win, guesses, dayIndex } = req.body;

  if (typeof win !== "boolean") {
    return res.status(400).json({ error: "Invalid win value" });
  }

  if (win && (!guesses || guesses < 1 || guesses > 6)) {
    return res.status(400).json({ error: "Invalid guess count" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const updated = updateStats({ win, guesses });
    return res.json(updated);
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET
    );

    await pool.query(
      `INSERT INTO game_results (user_id, day_index, win, guesses, played_at)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)
       ON CONFLICT (user_id, day_index) DO NOTHING`,
      [decoded.id, dayIndex ?? 0, win, win ? guesses : null]
    );

    const stats = await calcUserStats(decoded.id);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save stats" });
  }
});

// POST /api/stats/reset
router.post("/reset", (req, res) => {
  resetStats();
  res.json({ ok: true });
});

module.exports = router;