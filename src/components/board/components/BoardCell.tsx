import { memo } from "react";

import { constants, cn } from "@/utils";

type BoardCellProps = {
  isAlive: boolean;
  onClick: () => void;
  testId: string;
};

export const BoardCell = memo((props: BoardCellProps) => (
  <div
    data-testid={props.testId}
    className={cn(
      "border-solid border-2 border-gray-300",
      `w-${constants.BOARD_CELL_SIZE} h-${constants.BOARD_CELL_SIZE}`,
      props.isAlive ? "bg-red-500" : "bg-slate-50"
    )}
    onClick={props.onClick}
  />
));
