const router = express.Router();
const pool = require("../config/db");

// GET /api/leaderboard
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        name,
        avatar,
        played,
        wins,
        win_rate,
        max_streak
        FROM leaderboard
        LIMIT 20`,
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
