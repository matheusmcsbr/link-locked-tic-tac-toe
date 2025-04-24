
export type Player = "X" | "O";
export type BoardState = (Player | null)[];
export type GameStatus = "playing" | "won" | "draw";

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
}
