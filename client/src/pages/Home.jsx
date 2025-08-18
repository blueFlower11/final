import React from "react";
import { Link } from "react-router-dom";
import GameHistory from "../components/GameHistory";

export default function Home() {
  return (
    <div>
      <h2>Welcome to Tic Tac Toe</h2>
      <p>
        <Link to="/game/new">Start New Game</Link>
      </p>
      <p>
        <Link to="/ai">Play against AI</Link>
      </p>
      <GameHistory />
    </div>
  );
}
