import { memo } from "react";

import { cn } from "@/utils";

type BoardCellProps = {
  isAlive: boolean;
  onClick: () => void;
};

export const BoardCell = memo((props: BoardCellProps) => (
  <div
    className={cn(
      "w-7 h-7 border-solid border-2 border-gray-300",
      props.isAlive ? "bg-red-500" : "bg-slate-50"
    )}
    onClick={props.onClick}
  />
));
