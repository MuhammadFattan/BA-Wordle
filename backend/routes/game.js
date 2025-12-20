const express = require("express");
const router = express.Router();
const words = require("../data/words.json");
const checkGuess = require("../logic/checkGuess");

router.get("/today", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const index =
    today
      .split("-")
      .join("")
      .split("")
      .reduce((a, b) => a + Number(b), 0) % words.length;

  res.json({
    length: 5,
    index,
  });
});

router.post("/guess", (req, res) => {
  const { guess } = req.body;

  if (!guess || guess.length !== 5) {
    return res.status(400).json({ error: "Invalid guess" });
  }

  const today = new Date().toISOString().slice(0, 10);
  const index =
    today
      .split("-")
      .join("")
      .split("")
      .reduce((a, b) => a + Number(b), 0) % words.length;

  const target = words[index].word;

  const result = checkGuess(guess.toUpperCase(), target);

  res.json({ result });
});

module.exports = router;
