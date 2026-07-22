import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { memo } from "react";
import { Handle, Position } from "reactflow";

export type CustomNodeData = {
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
  category: string;
};

function CustomNode({ data }: { data: CustomNodeData }) {
  const statusStyles = {
    completed: "border-emerald-500/40 bg-emerald-500/8 text-emerald-700",
    current: "border-primary bg-primary/8 text-primary",
    locked: "border-border bg-muted/40 text-muted-foreground",
  };

  const StatusIcon = {
    completed: CheckCircle2,
    current: PlayCircle,
    locked: Lock,
  }[data.status];

  return (
    <div
      className={`px-4 py-3 shadow-sm rounded-2xl border-2 min-w-[220px] bg-card transition-transform duration-200 hover:scale-[1.02] ${statusStyles[data.status]}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-muted-foreground !border-0"
      />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            {data.category}
          </span>
          <StatusIcon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground leading-tight">
            {data.title}
          </h3>
          <p className="text-xs opacity-70 mt-1 line-clamp-2">
            {data.description}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-primary !border-0"
      />
    </div>
  );
}

export default memo(CustomNode);
