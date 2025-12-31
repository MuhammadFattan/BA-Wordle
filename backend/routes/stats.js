const express = require("express");
const router = express.Router();
const { updateStats, getStats, resetStats } = require("../data/stats");

router.get("/", (req, res) => {
  res.json(getStats());
});

router.post("/", (req, res) => {
  const { win, guesses } = req.body;

  if (typeof win !== "boolean") {
    return res.status(400).json({ error: "Invalid win value" });
  }

  if (win && (!guesses || guesses < 1 || guesses > 6)) {
    return res.status(400).json({ error: "Invalid guess count" });
  }

  const updated = updateStats({ win, guesses });
  res.json(updated);
});

router.post("/reset", (req, res) => {
  resetStats();
  res.json({ ok: true });
});

module.exports = router;
