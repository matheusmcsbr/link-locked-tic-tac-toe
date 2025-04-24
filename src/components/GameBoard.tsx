
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BoardState, GameState, Player } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";

interface GameBoardProps {
  gameState: GameState;
  onMove: (index: number) => void;
}

const GameBoard = ({ gameState, onMove }: GameBoardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState.status === "won") {
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

  const renderCell = (index: number, value: Player | null) => (
    <button
      key={index}
      onClick={() => onMove(index)}
      disabled={value !== null || gameState.status !== "playing"}
      className={`w-24 h-24 bg-gray-100 border border-gray-200 text-4xl font-bold 
        transition-all duration-200 ease-in-out hover:bg-purple-50 disabled:hover:bg-gray-100
        ${value ? "text-purple-600" : ""}`}
    >
      {value}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-xl font-semibold text-gray-700">
        {gameState.status === "playing" ? (
          <span>Current Player: <span className="text-purple-600">{gameState.currentPlayer}</span></span>
        ) : gameState.status === "won" ? (
          <span>Player <span className="text-purple-600">{gameState.winner}</span> wins!</span>
        ) : (
          <span>Game Draw!</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow-lg">
        {gameState.board.map((value, index) => renderCell(index, value))}
      </div>
    </div>
  );
};

export default GameBoard;
