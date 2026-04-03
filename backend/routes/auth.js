const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

// GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// GET /auth/me
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.avatar,
    });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// POST /auth/logout
router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

module.exports = router;