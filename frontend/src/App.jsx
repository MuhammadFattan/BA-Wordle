import { Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import Menu from "./pages/Menu";
import LoginPage, { AuthCallbackPage } from "./pages/LoginPage";
import LeaderboardPage from "./pages/LeaderboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/game" element={<Game />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/Leaderboard" element={<LeaderboardPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
    </Routes>
  );
}