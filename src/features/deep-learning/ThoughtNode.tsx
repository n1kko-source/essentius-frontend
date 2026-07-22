"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

export type ThoughtNodeData = {
  title: string;
  preview: string;
};

function ThoughtNode({ data, selected }: NodeProps<ThoughtNodeData>) {
  return (
    <div
      className={`thought-particle group relative flex flex-col items-center transition-[width,transform] duration-300 ease-out ${
        selected ? "w-[220px] z-10" : "w-[72px]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-primary/50 !border-0 !opacity-0"
      />

      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
          selected
            ? "h-20 w-20 shadow-[0_0_0_10px_color-mix(in_oklab,var(--focus)_16%,transparent),0_0_36px_color-mix(in_oklab,var(--focus)_35%,transparent)]"
            : "h-12 w-12 shadow-[0_0_0_6px_color-mix(in_oklab,var(--focus)_10%,transparent),0_0_20px_color-mix(in_oklab,var(--focus)_22%,transparent)] group-hover:h-14 group-hover:w-14"
        }`}
        style={{
          background:
            "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--focus) 70%, white), color-mix(in oklab, var(--focus) 55%, transparent) 55%, color-mix(in oklab, var(--ink) 18%, transparent) 100%)",
        }}
      >
        <span
          className="pointer-events-none absolute inset-[-10px] rounded-full border border-primary/15 animate-[thought-orbit_8s_linear_infinite]"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -top-0.5 right-1 h-1.5 w-1.5 rounded-full bg-primary/70 animate-[thought-dot_3.2s_ease-in-out_infinite]"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-1 left-0 h-1 w-1 rounded-full bg-foreground/35 animate-[thought-dot_4s_ease-in-out_infinite_0.4s]"
          aria-hidden
        />
        <span
          className={`rounded-full bg-card/90 transition-all duration-300 ${
            selected ? "h-3 w-3" : "h-2 w-2"
          }`}
        />
      </div>

      <div
        className={`mt-2 text-center transition-all duration-300 ${
          selected
            ? "opacity-100 max-h-40"
            : "opacity-80 max-h-10 group-hover:opacity-100"
        }`}
      >
        <h3
          className={`font-display tracking-tight text-foreground leading-snug ${
            selected
              ? "text-sm line-clamp-2"
              : "text-[11px] line-clamp-1 max-w-[72px]"
          }`}
        >
          {data.title}
        </h3>
        {selected ? (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-3 max-w-[200px]">
            {data.preview}
          </p>
        ) : null}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-primary/50 !border-0 !opacity-0"
      />
    </div>
  );
}

export default memo(ThoughtNode);
