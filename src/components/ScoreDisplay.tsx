
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface ScoreDisplayProps {
  scoreX: number;
  scoreO: number;
}

const ScoreDisplay = ({ scoreX, scoreO }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center justify-center gap-8 mb-6">
      <div className="flex items-center gap-2">
        <span className="font-medium text-lg">Player X</span>
        <Badge variant="secondary" className="text-lg px-3">
          {scoreX}
        </Badge>
        {scoreX >= 3 && <Trophy className="text-yellow-500 h-5 w-5" />}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-lg">Player O</span>
        <Badge variant="secondary" className="text-lg px-3">
          {scoreO}
        </Badge>
        {scoreO >= 3 && <Trophy className="text-yellow-500 h-5 w-5" />}
      </div>
    </div>
  );
};

export default ScoreDisplay;
