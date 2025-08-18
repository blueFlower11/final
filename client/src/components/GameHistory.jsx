import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function GameHistory() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get("/game/history").then((res) => setGames(res.data));
  }, []);

  return (
    <div>
      <h2>Past Games</h2>
      <ul>
        {games.map((g) => (
          <li key={g.id}>
            {g.players.join(" vs ")} - Winner: {g.winner || "Draw"}
          </li>
        ))}
      </ul>
    </div>
  );
}
