
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GameState } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getInitialGameState,
  checkWinner,
  checkDraw,
  generateGameId,
  encodeGameState,
  decodeGameState,
} from "@/utils/gameUtils";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const { toast } = useToast();

  useEffect(() => {
    const gameData = searchParams.get("game");
    if (gameData) {
      setGameState(decodeGameState(gameData));
    }
  }, []);

  const handleMove = (index: number) => {
    if (gameState.board[index] || gameState.status !== "playing") return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const isDraw = !winner && checkDraw(newBoard);

    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      status: winner ? "won" : isDraw ? "draw" : "playing",
      winner: winner,
    };

    setGameState(newGameState);
    setSearchParams({ game: encodeGameState(newGameState) });
  };

  const handleNewGame = () => {
    const newGameState = getInitialGameState();
    setGameState(newGameState);
    setSearchParams({ game: encodeGameState(newGameState) });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Share this link with your opponent to play together.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Tic Tac Toe</h1>
        <GameBoard gameState={gameState} onMove={handleMove} />
        <div className="flex justify-center gap-4">
          <Button onClick={handleNewGame}>New Game</Button>
          <Button onClick={handleShare} variant="outline">Share Game</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
