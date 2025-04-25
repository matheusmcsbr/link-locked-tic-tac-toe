import { BoardState, Player, GameState } from "@/types/game";

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export function checkWinner(board: BoardState): Player | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function checkDraw(board: BoardState): boolean {
  return board.every(cell => cell !== null);
}

export function generateGameId(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export const getInitialGameState = (): GameState => ({
  board: Array(9).fill(null),
  currentPlayer: "X",
  status: "playing",
  winner: null,
});

export function encodeGameState(gameState: GameState): string {
  return btoa(JSON.stringify(gameState));
}

export function decodeGameState(encoded: string): GameState {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return getInitialGameState();
  }
}
