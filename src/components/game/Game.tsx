import { Board, Button, SetupBoard } from "@/components";

import { useGame } from "./use-game";

export const Game = () => {
  const game = useGame();

  if (!game.board[0]) {
    return null;
  }

  return (
    <div className="flex w-screen h-screen flex-col gap-y-4 justify-center items-center bg-slate-100 overflow-x-scroll overflow-y-scoll">
      <h1 className="text-3xl font-bold text-slate-750">Game of Life</h1>
      <SetupBoard />
      <Board onClickCell={game.onClickCell} board={game.board} />
      <div className="flex gap-x-4 gap-y-2 justify-around">
        <Button
          onClick={game.onClickNextState}
          disabled={game.isPlayingForever}
        >
          Next State
        </Button>
        <Button onClick={game.onClickPlayForever}>{`${
          game.isPlayingForever ? "Stop" : "Start"
        } Play Forever`}</Button>
        <Button
          onClick={game.onClickAdvanceStateUpdates}
          disabled={game.isPlayingForever}
        >
          {`Advance ${
            game.advanceXStateUpdates === 1
              ? `1 update`
              : `${game.advanceXStateUpdates} updates`
          }`}
        </Button>
        <Button onClick={game.onClickReset} variant="secondary">
          Reset
        </Button>
      </div>
    </div>
  );
};
