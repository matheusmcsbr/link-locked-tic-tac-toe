
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
  const [isFirstPlayer, setIsFirstPlayer] = useState(true);
  const { toast } = useToast();

  // Load game state from URL if available
  useEffect(() => {
    const gameData = searchParams.get("game");
    if (gameData) {
      try {
        const decodedState = decodeGameState(gameData);
        setGameState(decodedState);
        setIsFirstPlayer(false);
      } catch (error) {
        console.error("Failed to decode game state:", error);
        const newState = getInitialGameState();
        setGameState(newState);
        setSearchParams({ game: encodeGameState(newState) });
      }
    } else {
      const newState = getInitialGameState();
      setGameState(newState);
      setSearchParams({ game: encodeGameState(newState) });
    }
  }, []);

  const handleMove = (index: number) => {
    // Check if it's the player's turn
    const isPlayerTurn = (isFirstPlayer && gameState.currentPlayer === "X") || 
                        (!isFirstPlayer && gameState.currentPlayer === "O");

    if (!isPlayerTurn) {
      toast({
        title: "Not your turn",
        description: "Please wait for the other player to make their move.",
        variant: "destructive",
      });
      return;
    }

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
    if (!isFirstPlayer) {
      toast({
        title: "Not Allowed",
        description: "Only the first player can start a new game.",
        variant: "destructive",
      });
      return;
    }
    
    const newGameState = getInitialGameState();
    setGameState(newGameState);
    setSearchParams({ game: encodeGameState(newGameState) });
  };

  const handleShare = () => {
    if (!isFirstPlayer) {
      toast({
        title: "Not Allowed",
        description: "Only the first player can share the game.",
        variant: "destructive",
      });
      return;
    }

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
          {isFirstPlayer && (
            <>
              <Button onClick={handleNewGame}>New Game</Button>
              <Button onClick={handleShare} variant="outline">Share Game</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
