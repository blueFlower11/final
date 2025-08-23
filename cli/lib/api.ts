import { API_BASE, ENDPOINT_LEARNING, ENDPOINT_STATIC, ENDPOINT_SAVE } from "./config";

export type Cell = "X" | "O" | null;
export type Board = Cell[];

function toPipeBoard(board: Board): string {
  // convert array of 9 cells into a single string with pipes around it
  const s = board.map(c => (c ? c : " ")).join("");
  return `|${s}|`;
}

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
  console.log(toPipeBoard(board));
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board: toPipeBoard(board), player }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Bot move error:", e);
    return null;
  }
}

export type SaveItem = { boardId: number; position: number }; // position is 0..8 in the DB orientation
export type SaveResult = "win" | "draw" | "duce" | "tie" | "lose";

export async function requestSave({
  list,
  result,
  table = "smart",
}: {
  list: SaveItem[];
  result: SaveResult;
  table?: "smart" | "stupid";
}): Promise<
  | {
      ok: true;
      updates?: Array<{
        boardId: number;
        position: number;
        from?: number;
        to?: number;
        skipped?: boolean;
        reason?: string;
      }>;
      skipped?: boolean;
      reason?: string;
      table?: string;
    }
  | { ok?: false; error: string }
> {
  try {
    const res = await fetch(`${API_BASE}${ENDPOINT_SAVE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ list, result, table }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // backend sends 400 with { error }
      return { ok: false as const, error: data?.error ?? `HTTP ${res.status}` };
    }
    return data;
  } catch (e: any) {
    console.error("Save error:", e);
    return { ok: false, error: String(e?.message || e) };
  }
}
