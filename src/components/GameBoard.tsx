
import { GameState, Player } from "@/types/game";
import { X, Circle } from "lucide-react";

interface GameBoardProps {
  gameState: GameState;
  onMove: (index: number) => void;
}

const GameBoard = ({ gameState, onMove }: GameBoardProps) => {
  const renderCell = (index: number, value: Player | null) => (
    <button
      key={index}
      onClick={() => onMove(index)}
      disabled={value !== null || gameState.status !== "playing"}
      className={`
        w-24 h-24 relative
        border-slate-600
        transition-all duration-200
        hover:bg-slate-50 disabled:hover:bg-transparent
        flex items-center justify-center
        ${index % 3 !== 2 ? 'border-r-4' : ''}
        ${index < 6 ? 'border-b-4' : ''}
      `}
    >
      {value === "X" && (
        <X
          className="w-16 h-16 text-indigo-600 animate-in fade-in duration-200"
          strokeWidth={3}
        />
      )}
      {value === "O" && (
        <Circle
          className="w-14 h-14 text-rose-600 animate-in fade-in duration-200"
          strokeWidth={3}
        />
      )}
    </button>
  );

  return (
    <div className="relative">
      <div 
        className="
          grid grid-cols-3 gap-0
          bg-white rounded-lg p-6
          shadow-[0_2px_10px_rgba(0,0,0,0.1)]
          transform rotate-[0.5deg]
          border-2 border-slate-200
        "
      >
        {gameState.board.map((value, index) => renderCell(index, value))}
      </div>
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GameBoard;
