
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
  generateGameId,
  encodeGameState,
  decodeGameState,
} from "@/utils/gameUtils";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [isFirstPlayer, setIsFirstPlayer] = useState(true);
  const [gameNumber, setGameNumber] = useState<string>(generateGameId());
  const { toast } = useToast();
  const lastGameData = useRef<string | null>(null);
  const pollingInterval = useRef<number | null>(null);

  useEffect(() => {
    const gameData = searchParams.get("game");
    const urlGameNumber = searchParams.get("gameNumber");
    
    if (gameData) {
      try {
        const decodedState = decodeGameState(gameData);
        setGameState(decodedState);
        setIsFirstPlayer(false);
        lastGameData.current = gameData;
        if (urlGameNumber) {
          setGameNumber(urlGameNumber);
        }
      } catch (error) {
        console.error("Failed to decode game state:", error);
        const newGameNumber = generateGameId();
        const newState = getInitialGameState();
        setGameState(newState);
        setGameNumber(newGameNumber);
        setSearchParams({ game: encodeGameState(newState), gameNumber: newGameNumber });
        lastGameData.current = encodeGameState(newState);
        setIsFirstPlayer(true);
      }
    } else {
      const newGameNumber = generateGameId();
      const newState = getInitialGameState();
      setGameState(newState);
      setGameNumber(newGameNumber);
      setSearchParams({ game: encodeGameState(newState), gameNumber: newGameNumber });
      lastGameData.current = encodeGameState(newState);
      setIsFirstPlayer(true);
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

  useEffect(() => {
    const handleURLChange = () => {
      const currentGameData = searchParams.get("game");
      if (currentGameData && currentGameData !== lastGameData.current) {
        try {
          const decodedState = decodeGameState(currentGameData);
          setGameState(decodedState);
          lastGameData.current = currentGameData;
        } catch (error) {
          console.error("Failed to decode game state from URL change:", error);
        }
      }
    };

    window.addEventListener('popstate', handleURLChange);
    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, [searchParams]);

  const handleMove = (index: number) => {
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
    const encodedState = encodeGameState(newGameState);
    setSearchParams({ game: encodedState, gameNumber });
    lastGameData.current = encodedState;
  };

  const handleNewGame = () => {
    const newGameNumber = generateGameId();
    const newGameState = getInitialGameState();
    setGameState(newGameState);
    setGameNumber(newGameNumber);
    const encodedState = encodeGameState(newGameState);
    const newParams = new URLSearchParams();
    newParams.set('game', encodedState);
    newParams.set('gameNumber', newGameNumber);
    setSearchParams(newParams);
    lastGameData.current = encodedState;

    toast({
      title: "New Game Started",
      description: "Share the new game link with your opponent!",
    });
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Tic Tac Toe</h1>
          <p className="text-gray-600">Game #{gameNumber}</p>
          <p className="text-purple-600 font-medium">
            You are Player {isFirstPlayer ? "1 (X)" : "2 (O)"}
          </p>
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
        {isFirstPlayer && (
          <div className="flex justify-center gap-4">
            <Button onClick={handleNewGame}>New Game</Button>
            <Button onClick={handleShare} variant="outline">Share Game</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
