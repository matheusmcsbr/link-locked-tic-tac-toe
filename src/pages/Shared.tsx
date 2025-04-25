
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { GameState } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import { useToast } from "@/hooks/use-toast";
import {
  getInitialGameState,
  checkWinner,
  checkDraw,
  decodeGameState,
  encodeGameState,
} from "@/utils/gameUtils";

const Shared = () => {
  const [searchParams] = useSearchParams();
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const { toast } = useToast();
  const lastGameData = useRef<string | null>(null);
  const pollingInterval = useRef<number | null>(null);
  const gameNumber = searchParams.get("gameNumber") || "";

  useEffect(() => {
    const gameData = searchParams.get("game");
    
    if (gameData) {
      try {
        const decodedState = decodeGameState(gameData);
        setGameState(decodedState);
        lastGameData.current = gameData;
      } catch (error) {
        console.error("Failed to decode game state:", error);
      }
    }

    pollingInterval.current = window.setInterval(() => {
      const currentGameData = searchParams.get("game");
      if (currentGameData && currentGameData !== lastGameData.current) {
        try {
          const decodedState = decodeGameState(currentGameData);
          setGameState(decodedState);
          lastGameData.current = currentGameData;
        } catch (error) {
          console.error("Failed to decode game state during polling:", error);
        }
      }
    }, 1000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [searchParams]);

  const handleMove = (index: number) => {
    if (gameState.currentPlayer !== "O") {
      toast({
        title: "Not your turn",
        description: "Please wait for Player 1 to make their move.",
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
      currentPlayer: "X",
      status: winner ? "won" : isDraw ? "draw" : "playing",
      winner: winner,
    };

    setGameState(newGameState);
    const params = new URLSearchParams(searchParams);
    params.set("game", encodeGameState(newGameState));
    window.history.replaceState({}, "", `?${params.toString()}`);
    lastGameData.current = encodeGameState(newGameState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Tic Tac Toe</h1>
          <p className="text-gray-600">Game #{gameNumber}</p>
          <p className="text-purple-600 font-medium">You are Player 2 (O)</p>
          <p className="text-gray-700">
            {gameState.status === "playing" ? 
              `Current Turn: ${gameState.currentPlayer === "X" ? "Player 1 (X)" : "Player 2 (O)"}` :
              gameState.status === "won" ? 
                `Winner: Player ${gameState.winner === "X" ? "1 (X)" : "2 (O)"}` : 
                "Game Draw!"
            }
          </p>
        </div>
        <GameBoard gameState={gameState} onMove={handleMove} />
      </div>
    </div>
  );
};

export default Shared;
