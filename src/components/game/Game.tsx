import { SetupBoard, Button, Board } from "..";

import { useGame } from "./use-game";

export const Game = () => {
  const game = useGame();

  if (!game.board[0] && game.error) {
    return (
      <div className="flex w-screen h-screen justify-center items-center bg-slate-100">
        <h1 className="text-2xl text-red-600" data-testid="error-message">
          {game.error}
        </h1>
      </div>
    );
  }

  if (!game.board[0]) {
    return null;
  }

  return (
    <div
      className="flex w-screen h-screen flex-col gap-y-4 justify-center items-center bg-slate-100 overflow-x-scroll overflow-y-scoll"
      data-testid="game"
    >
      <h1 className="text-3xl font-bold text-slate-750">Game of Life TEST</h1>
      <SetupBoard />
      <Board onClickCell={game.onClickCell} board={game.board} />
      {game.error && (
        <h1 className="text-2xl text-red-600" data-testid="error-message">
          {game.error}
        </h1>
      )}
      <div className="flex gap-x-4 gap-y-2 justify-around">
        <Button
          onClick={game.onClickNextState}
          disabled={game.isPlayingForever}
          data-testid="next-state-button"
        >
          Next State
        </Button>
        <Button
          onClick={game.onClickPlayForever}
          data-testid="start-play-forever-button"
        >{`${game.isPlayingForever ? "Stop" : "Start"} Play Forever`}</Button>
        <Button
          onClick={game.onClickAdvanceStateUpdates}
          disabled={game.isPlayingForever}
          data-testid="advance-updates-button"
        >
          {`Advance ${
            game.advanceXStateUpdates === 1
              ? `1 update`
              : `${game.advanceXStateUpdates} updates`
          }`}
        </Button>
        <Button
          onClick={game.onClickReset}
          variant="secondary"
          data-testid="reset-button"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
