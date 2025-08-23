import { API_BASE, ENDPOINT_LEARNING, ENDPOINT_STATIC, ENDPOINT_SAVE } from "./config";

export type Cell = "X" | "O" | null;
export type Board = Cell[];

export async function requestBotMove({
  board,
  player,
  mode,
}: {
  board: Board;
  player: "X" | "O";
  mode: "learning" | "static";
}): Promise<{ index: number; board?: Board; winner?: "X" | "O" | null; draw?: boolean; } | null> {
  const endpoint = mode === "learning" ? ENDPOINT_LEARNING : ENDPOINT_STATIC;
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board, player }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Bot move error:", e);
    return null;
  }
}

export async function requestSave(payload: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}${ENDPOINT_SAVE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
}
