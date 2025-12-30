import { Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import Menu from "./pages/Menu";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
