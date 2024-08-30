import { Board } from "@/types";
import { board } from "@/lib";

type SuccessResponse = {
  ok: true;
  board: Board;
};

type ErrorResponse = {
  ok: false;
};

type Response = SuccessResponse | ErrorResponse;

export const generateInitialBoard = (boardSize: number): Promise<Response> => {
  return new Promise((resolve) => {
    const initialBoard = board.generateInitialBoard(boardSize);
    resolve({
      ok: true,
      board: initialBoard,
    });
  });
};

export const computeNextState = (currentBoard: Board): Promise<Response> => {
  return new Promise((resolve) => {
    const nextBoardState = board.computeNextState(currentBoard);
    resolve({
      ok: true,
      board: nextBoardState,
    });
  });
};

export const advanceXStateUpdates = (
  currentBoard: Board,
  numberStateUpdates: number
): Promise<Response> => {
  return new Promise((resolve) => {
    let boardStateAfterXUpdates = currentBoard;
    for (let i = 0; i < numberStateUpdates; i++) {
      boardStateAfterXUpdates = board.computeNextState(boardStateAfterXUpdates);
    }
    resolve({
      ok: true,
      board: boardStateAfterXUpdates,
    });
  });
};

type ToggleCellStateParams = {
  board: Board;
  row: number;
  column: number;
};

export const toggleCellState = (
  params: ToggleCellStateParams
): Promise<Response> => {
  return new Promise((resolve) => {
    const boardUpdated = board.toggleCellState(params);
    resolve({
      ok: true,
      board: boardUpdated,
    });
  });
};
