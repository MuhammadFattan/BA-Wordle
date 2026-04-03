require("dotenv").config();
require("./config/passport");

const express = require("express");
const cors = require("cors");

const gameRoutes = require("./routes/game");
const statsRoute = require("./routes/stats");
const authRoutes = require("./routes/auth");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/game", gameRoutes);
app.use("/api/stats", statsRoute);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
