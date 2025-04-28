
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface ScoreDisplayProps {
  scoreX: number;
  scoreO: number;
}

const ScoreDisplay = ({ scoreX, scoreO }: ScoreDisplayProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
      <div className="flex items-center gap-3 px-4 py-2 bg-white/80 rounded-lg shadow-sm">
        <span className="font-semibold text-lg text-blue-700">Player X</span>
        <Badge variant="secondary" className="text-lg px-3 bg-blue-100 text-blue-800 border border-blue-200">
          {scoreX}
        </Badge>
        {scoreX >= 3 && <Trophy className="text-yellow-500 h-5 w-5" />}
      </div>
      <div className="flex items-center gap-3 px-4 py-2 bg-white/80 rounded-lg shadow-sm">
        <span className="font-semibold text-lg text-red-700">Player O</span>
        <Badge variant="secondary" className="text-lg px-3 bg-red-100 text-red-800 border border-red-200">
          {scoreO}
        </Badge>
        {scoreO >= 3 && <Trophy className="text-yellow-500 h-5 w-5" />}
      </div>
    </div>
  );
};

export default ScoreDisplay;
