
import { GameState, Player } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface GameBoardProps {
  gameState: GameState;
  onMove: (index: number) => void;
}

const GameBoard = ({ gameState, onMove }: GameBoardProps) => {
  const { toast } = useToast();

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
    <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow-lg">
      {gameState.board.map((value, index) => renderCell(index, value))}
    </div>
  );
};

export default GameBoard;
