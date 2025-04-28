
import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ScoreDisplay from "@/components/ScoreDisplay";
import {
  getInitialGameState,
  checkWinner,
  checkDraw,
} from "@/utils/gameUtils";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (gameState.status === "won") {
      const winner = gameState.winner;
      if (winner === "X") {
        setScoreX(prev => {
          const newScore = prev + 1;
          if (newScore >= 3) {
            toast({
              title: "Game Over!",
              description: "Player X wins the match!",
            });
          }
          return newScore;
        });
      } else {
        setScoreO(prev => {
          const newScore = prev + 1;
          if (newScore >= 3) {
            toast({
              title: "Game Over!",
              description: "Player O wins the match!",
            });
          }
          return newScore;
        });
      }
      toast({
        title: "Game Over!",
        description: `Player ${gameState.winner} wins!`,
      });
    } else if (gameState.status === "draw") {
      toast({
        title: "Game Over!",
        description: "It's a draw!",
      });
    }
  }, [gameState.status, gameState.winner]);

  const handleMove = (index: number) => {
    if (gameState.board[index] || gameState.status !== "playing" || 
        (scoreX >= 3 || scoreO >= 3)) return;

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
  };

  const handleNewGame = () => {
    if (scoreX >= 3 || scoreO >= 3) {
      setScoreX(0);
      setScoreO(0);
      toast({
        title: "New Match Started",
        description: "Scores have been reset for a new match!",
      });
    }
    setGameState(getInitialGameState());
    toast({
      title: "New Game Started",
      description: "The board has been reset for a new game!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-800 font-serif tracking-tight">Tic Tac Toe</h1>
          <ScoreDisplay scoreX={scoreX} scoreO={scoreO} />
          <p className="text-slate-700 text-lg font-medium">
            {gameState.status === "playing" ? 
              `Current Turn: Player ${gameState.currentPlayer}` :
              gameState.status === "won" ? 
                `Winner: Player ${gameState.winner}` : 
                "Game Draw!"
            }
          </p>
        </div>
        <GameBoard gameState={gameState} onMove={handleMove} />
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleNewGame}
            className="shadow-lg hover:shadow-xl transition-all px-6 py-2 bg-amber-600 hover:bg-amber-700"
          >
            {scoreX >= 3 || scoreO >= 3 ? "New Match" : "New Game"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
