
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { GameState } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getInitialGameState,
  checkWinner,
  checkDraw,
  encodeGameState,
  decodeGameState,
} from "@/utils/gameUtils";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const { toast } = useToast();
  const lastGameData = useRef<string | null>(null);
  const pollingInterval = useRef<number | null>(null);

  useEffect(() => {
    const gameData = searchParams.get("game");
    
    if (gameData) {
      try {
        const decodedState = decodeGameState(gameData);
        setGameState(decodedState);
        lastGameData.current = gameData;
      } catch (error) {
        console.error("Failed to decode game state:", error);
        const newState = getInitialGameState();
        setGameState(newState);
        setSearchParams({ game: encodeGameState(newState) });
        lastGameData.current = encodeGameState(newState);
      }
    } else {
      const newState = getInitialGameState();
      setGameState(newState);
      setSearchParams({ game: encodeGameState(newState) });
      lastGameData.current = encodeGameState(newState);
    }

    pollingInterval.current = window.setInterval(() => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentGameData = currentParams.get("game");
      
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
    lastGameData.current = encodeGameState(newGameState);
  };

  const handleNewGame = () => {
    const newGameState = getInitialGameState();
    setGameState(newGameState);
    const encodedState = encodeGameState(newGameState);
    setSearchParams({ game: encodedState });
    lastGameData.current = encodedState;

    toast({
      title: "New Game Started",
      description: "The board has been reset for a new game!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Tic Tac Toe</h1>
          <p className="text-gray-700 text-lg font-medium">
            {gameState.status === "playing" ? 
              `Current Turn: Player ${gameState.currentPlayer}` :
              gameState.status === "won" ? 
                `Winner: Player ${gameState.winner}` : 
                "Game Draw!"
            }
          </p>
        </div>
        <GameBoard gameState={gameState} onMove={handleMove} />
        <div className="flex justify-center">
          <Button onClick={handleNewGame}>New Game</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
