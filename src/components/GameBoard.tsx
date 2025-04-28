
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
        w-20 h-20 sm:w-24 sm:h-24 relative
        transition-all duration-200
        hover:bg-slate-50/50 disabled:hover:bg-transparent
        flex items-center justify-center
        ${index % 3 !== 2 ? 'border-r-2 sm:border-r-4 border-slate-500' : ''}
        ${index < 6 ? 'border-b-2 sm:border-b-4 border-slate-500' : ''}
      `}
    >
      {value === "X" && (
        <X
          className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 animate-in fade-in duration-300"
          strokeWidth={3.5}
        />
      )}
      {value === "O" && (
        <Circle
          className="w-10 h-10 sm:w-14 sm:h-14 text-red-600 animate-in fade-in duration-300"
          strokeWidth={3.5}
        />
      )}
    </button>
  );

  return (
    <div className="relative mx-auto max-w-sm transform rotate-[-1deg] hover:rotate-[0deg] transition-transform duration-300">
      <div 
        className="
          grid grid-cols-3 gap-0
          bg-amber-50 rounded-md p-4 sm:p-6
          shadow-[0_3px_15px_rgba(0,0,0,0.15)]
          border-2 border-amber-100
        "
      >
        {gameState.board.map((value, index) => renderCell(index, value))}
      </div>
      
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Coffee stain effect */}
      <div 
        className="absolute -bottom-6 -right-8 w-20 h-20 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(101,67,33,0.8) 0%, rgba(101,67,33,0.4) 40%, rgba(101,67,33,0) 70%)'
        }}
      />
      
      {/* Pencil scratch marks */}
      <div 
        className="absolute -top-4 -left-4 w-16 h-16 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,50 Q40,20 60,50 T100,50' fill='none' stroke='%23333333' stroke-width='1'/%3E%3Cpath d='M10,30 Q40,60 30,90' fill='none' stroke='%23333333' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GameBoard;
