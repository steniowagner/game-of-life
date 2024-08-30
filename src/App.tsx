/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef, useEffect } from "react";

import { BoardCellState, Board as BoardType } from "@/types";
import { Board, Button, SetupBoard } from "@/components";
import { useBoardSetup } from "@/contexts";

const generateInitialBoard = (boardSize: number) => {
  const board: BoardType = [];
  for (let i = 0; i < boardSize; i++) {
    board.push(Array(boardSize).fill(BoardCellState.DEAD));
  }
  return board;
};

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

export const App = () => {
  const [isPlayingForever, setIsPlayingForever] = useState(false);
  const [board, setBoard] = useState<BoardType>([]);

  const playingForeverRef = useRef(isPlayingForever);

  const { boardSetup } = useBoardSetup();

  const updateCellStateManually = useCallback((row: number, column: number) => {
    setBoard((oldBoard) => {
      const boardUpdated = oldBoard.map((row) => row.slice());
      boardUpdated[row][column] =
        boardUpdated[row][column] === BoardCellState.ALIVE
          ? BoardCellState.DEAD
          : BoardCellState.ALIVE;
      return boardUpdated;
    });
  }, []);

  type CountCellNeighborsParams = {
    board: BoardType;
    rowIndex: number;
    columnIndex: number;
  };

  const countCellNeighbors = useCallback((params: CountCellNeighborsParams) => {
    let cellNeighborsCount = 0;
    operations.forEach(([i, j]) => {
      const currentRowIndex = params.rowIndex + i;
      const currentColumnIndex = params.columnIndex + j;
      const isRowValid =
        currentRowIndex >= 0 && currentRowIndex < params.board.length;
      const isColumnValid =
        currentColumnIndex >= 0 && currentColumnIndex < params.board.length;
      if (isRowValid && isColumnValid) {
        cellNeighborsCount += params.board[currentRowIndex][currentColumnIndex];
      }
    });
    return cellNeighborsCount;
  }, []);

  const computeNextState = useCallback(
    (board: BoardType) => {
      const boardCopy = board.map((row) => row.slice());
      const nextState = boardCopy.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const cellNeighborsCount = countCellNeighbors({
            columnIndex,
            rowIndex,
            board,
          });
          const isUnderpopulation = cellNeighborsCount < 2;
          const isOverpopulation = cellNeighborsCount > 3;
          if (isUnderpopulation || isOverpopulation) {
            return BoardCellState.DEAD;
          }
          const isReproduction =
            cell === BoardCellState.DEAD && cellNeighborsCount === 3;
          if (isReproduction) {
            return BoardCellState.ALIVE;
          }
          return cell; // Survival state
        })
      );
      return nextState;
    },
    [countCellNeighbors]
  );

  const nextState = useCallback(() => {
    setIsPlayingForever(false);
    const boardUpdated = computeNextState(board);
    setBoard(boardUpdated);
  }, [board, computeNextState]);

  const togglePlayForever = useCallback(() => {
    setIsPlayingForever((isPlayingForever) => !isPlayingForever);
  }, []);

  const forwardUpdates = useCallback(() => {
    let nextBoard = board.map((row) => row.slice());
    for (let i = 0; i < boardSetup.advanceXStateUpdates; i++) {
      nextBoard = computeNextState(nextBoard);
    }
    setBoard(nextBoard);
  }, [computeNextState, board, boardSetup]);

  const resetBoard = useCallback(() => {
    setBoard(generateInitialBoard(boardSetup.boardSize));
    setIsPlayingForever(false);
  }, [boardSetup.boardSize]);

  useEffect(() => {
    playingForeverRef.current = isPlayingForever;
  }, [isPlayingForever]);

  useEffect(() => {
    if (!isPlayingForever) {
      return;
    }
    const loopComputingNextState = () => {
      if (!playingForeverRef.current) {
        return;
      }
      setBoard((oldBoard) => computeNextState(oldBoard));
      setTimeout(loopComputingNextState, boardSetup.playForeverTimeoutMs);
    };
    loopComputingNextState();
  }, [isPlayingForever]);

  useEffect(() => {
    setBoard(generateInitialBoard(boardSetup.boardSize));
    setIsPlayingForever(false);
  }, [boardSetup]);

  return (
    <div className="flex w-screen h-screen flex-col gap-y-4 justify-center items-center bg-slate-100 overflow-x-scroll overflow-y-scoll">
      <h1 className="text-3xl font-bold text-slate-750">Game of Life</h1>
      <SetupBoard />
      <Board updateCellStateManually={updateCellStateManually} board={board} />
      <div className="flex gap-x-4 gap-y-2 justify-around">
        <Button onClick={nextState} disabled={isPlayingForever}>
          Next State
        </Button>
        <Button onClick={togglePlayForever}>{`${
          isPlayingForever ? "Stop" : "Start"
        } Play Forever`}</Button>
        <Button onClick={forwardUpdates} disabled={isPlayingForever}>
          {`Advance ${
            boardSetup.advanceXStateUpdates === 1
              ? `1 update`
              : `${boardSetup.advanceXStateUpdates} updates`
          }`}
        </Button>
        <Button onClick={resetBoard} variant="secondary">
          Reset
        </Button>
      </div>
    </div>
  );
};
