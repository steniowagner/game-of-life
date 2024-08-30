import { BoardCellState, Board } from "@/types";

export const generateInitialBoard = (boardSize: number) => {
  const board: Board = [];
  for (let i = 0; i < boardSize; i++) {
    board.push(Array(boardSize).fill(BoardCellState.DEAD));
  }
  return board;
};

type CountCellNeighborsParams = {
  columnIndex: number;
  rowIndex: number;
  board: Board;
};

const countCellNeighbors = (params: CountCellNeighborsParams) => {
  const positionsAroundCell = [
    [0, 1],
    [0, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];
  let cellNeighborsCount = 0;
  positionsAroundCell.forEach(([i, j]) => {
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
};

export const computeNextState = (board: Board) => {
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
};

type ToggleCellStateParams = {
  board: Board;
  row: number;
  column: number;
};

export const toggleCellState = (params: ToggleCellStateParams) => {
  const boardCopy = params.board.map((row) => row.slice());
  const boardUpdated = boardCopy.map((row) => row.slice());
  boardUpdated[params.row][params.column] =
    boardUpdated[params.row][params.column] === BoardCellState.ALIVE
      ? BoardCellState.DEAD
      : BoardCellState.ALIVE;
  return boardUpdated;
};
