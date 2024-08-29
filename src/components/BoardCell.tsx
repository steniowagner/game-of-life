import { memo } from "react";

import { cn } from "@/utils";

type BoardCellProps = {
  isAlive: boolean;
  onClick: () => void;
};

export const BoardCell = memo((props: BoardCellProps) => (
  <div
    className={cn(
      "w-6 h-6 border-solid border-2 border-gray-400",
      props.isAlive ? "bg-slate-950" : "bg-slate-50"
    )}
    onClick={props.onClick}
  />
));
