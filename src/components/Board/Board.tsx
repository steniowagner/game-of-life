import { BoardCellState, Board as BoardType } from "@/types";
import { useBoardSetup } from "@/contexts";
import { constants } from "@/utils";

import { BoardCell } from "./components/BoardCell";

type BoardProps = {
  onClickCell: (rowIndex: number, columnIndex: number) => void;
  board: BoardType;
};

export const Board = (props: BoardProps) => {
  const { boardSetup } = useBoardSetup();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boardSetup.boardSize}, ${constants.BOARD_TEMPLATE_COLUMNS_SIZE})`,
        width: "fit-content",
      }}
    >
      {props.board.map((rows, rowIndex) =>
        rows.map((_column, columnIndex) => (
          <BoardCell
            key={`${rowIndex}-${columnIndex}`}
            isAlive={
              props.board[rowIndex][columnIndex] === BoardCellState.ALIVE
            }
            onClick={() => props.onClickCell(rowIndex, columnIndex)}
          />
        ))
      )}
    </div>
  );
};
