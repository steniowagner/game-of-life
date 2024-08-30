import { useState, useCallback, useRef, useEffect } from "react";

import { BoardCell, Button } from "@/components";
import { BoardCellState, Board } from "@/types";

const NUM_ROWS = 24;
const NUM_COLS = 24;

const generateInitialBoard = () => {
  const board: Board = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    board.push(Array(NUM_COLS).fill(BoardCellState.DEAD));
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
  const [board, setBoard] = useState<Board>(() => generateInitialBoard());
  const [isPlayingForever, setIsPlayingForever] = useState(false);

  const playingForeverRef = useRef(isPlayingForever);

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
    board: Board;
    rowIndex: number;
    columnIndex: number;
  };

  const countCellNeighbors = useCallback((params: CountCellNeighborsParams) => {
    let cellNeighborsCount = 0;
    operations.forEach(([i, j]) => {
      const currentRowIndex = params.rowIndex + i;
      const currentColumnIndex = params.columnIndex + j;
      const isRowValid = currentRowIndex >= 0 && currentRowIndex < NUM_ROWS;
      const isColumnValid =
        currentColumnIndex >= 0 && currentColumnIndex < NUM_COLS;
      if (isRowValid && isColumnValid) {
        cellNeighborsCount += params.board[currentRowIndex][currentColumnIndex];
      }
    });
    return cellNeighborsCount;
  }, []);

  const computeNextState = useCallback(
    (board: Board) => {
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
    for (let i = 0; i < 3; i++) {
      nextBoard = computeNextState(nextBoard);
    }
    setBoard(nextBoard);
  }, [computeNextState, board]);

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
      setTimeout(loopComputingNextState, 300);
    };
    loopComputingNextState();
  }, [computeNextState, isPlayingForever]);

  return (
    <div className="flex w-screen h-screen flex-col gap-y-4 justify-center items-center bg-slate-100 overflow-x-scroll overflow-y-scoll">
      <h1 className="text-3xl font-bold text-slate-750">Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${NUM_COLS}, 1.75rem)`,
          width: "fit-content",
        }}
      >
        {board.map((rows, rowIndex) =>
          rows.map((_column, columnIndex) => (
            <BoardCell
              key={`${rowIndex}-${columnIndex}`}
              isAlive={board[rowIndex][columnIndex] === BoardCellState.ALIVE}
              onClick={() => updateCellStateManually(rowIndex, columnIndex)}
            />
          ))
        )}
      </div>
      <div className="flex gap-x-4 justify-around">
        <Button onClick={nextState}>Next State</Button>
        <Button onClick={togglePlayForever}>{`${
          isPlayingForever ? "Stop" : "Start"
        } Play forever`}</Button>
        <Button onClick={forwardUpdates}>Forward updates</Button>
        <Button onClick={nextState} variant="secondary">
          Reset
        </Button>
      </div>
    </div>
  );
};
