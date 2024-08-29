export enum BoardCellState {
  ALIVE = 1,
  DEAD = 0,
}

export type Board = BoardCellState[][];
