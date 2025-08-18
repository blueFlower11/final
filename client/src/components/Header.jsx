import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <h1>Tic Tac Toe</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/ai">Play AI</Link>
      </nav>
    </header>
  );
}
