import { Board } from "@/types";
import { board } from "@/lib";

export const generateInitialBoard = (boardSize: number): Promise<Board> => {
  return new Promise((resolve) => {
    const initialBoard = board.generateInitialBoard(boardSize);
    resolve(initialBoard);
  });
};

export const computeNextState = (currentBoard: Board): Promise<Board> => {
  return new Promise((resolve) => {
    const nextBoardState = board.computeNextState(currentBoard);
    resolve(nextBoardState);
  });
};

export const advanceXStateUpdates = (
  currentBoard: Board,
  numberStateUpdates: number
): Promise<Board> => {
  return new Promise((resolve) => {
    let boardStateAfterXUpdates = currentBoard;
    for (let i = 0; i < numberStateUpdates; i++) {
      boardStateAfterXUpdates = board.computeNextState(currentBoard);
    }
    resolve(boardStateAfterXUpdates);
  });
};
