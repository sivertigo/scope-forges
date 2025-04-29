import {
  FileText,
  RefreshCw,
  Maximize2,
  Minimize2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ERDIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function ERDIconButton({ icon, label, onClick }: ERDIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} variant="outline" size="sm" className="p-2">
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export const RefreshIcon = () => <RefreshCw className="w-4 h-4" />;
export const MaximizeIcon = () => <Maximize2 className="w-4 h-4" />;
export const MinimizeIcon = () => <Minimize2 className="w-4 h-4" />;
export const FileTextIcon = () => <FileText className="w-4 h-4" />;
export const DatabaseIcon = () => <Database className="w-4 h-4" />;
