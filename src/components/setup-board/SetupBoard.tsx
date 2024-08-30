import { Input, Button } from "@/components";

import { useSetupBoard } from "./use-setup-board";

export const SetupBoard = () => {
  const setupBoard = useSetupBoard();

  return (
    <div className="flex gap-y-2 items-end gap-x-4">
      <Input
        label="Advance updates"
        value={setupBoard.advanceXStateUpdates}
        onChange={(e) =>
          setupBoard.changeAdvanceXStateUpdates(parseInt(e.target.value))
        }
        type="number"
        min={1}
        max={10}
      />
      <Input
        label="Board size"
        value={setupBoard.boardSize}
        onChange={(e) => setupBoard.changeBoardSize(parseInt(e.target.value))}
        type="number"
        min={1}
        max={24}
      />
      <Input
        label="Play Forever Interval (ms)"
        value={setupBoard.playForeverTimeoutMs}
        onChange={(e) =>
          setupBoard.changePlayForeverTimeoutMs(parseInt(e.target.value))
        }
        type="number"
        min={50}
        step={50}
      />
      <Button onClick={setupBoard.onClickApply} size="sm">
        Apply
      </Button>
    </div>
  );
};
