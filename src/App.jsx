import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScoreList from "./pages/ScoreList";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/scorelist" element={<ScoreList />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;