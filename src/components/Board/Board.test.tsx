import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";

import { constants } from "@/utils";
import { board } from "@/lib";

import { Board } from "./Board";

class Sut {
  user: UserEvent;

  constructor(onClickCell?: Mock) {
    const gameBoard = board.generateInitialBoard(
      constants.initialBoardSetup.boardSize
    );
    render(<Board onClickCell={onClickCell ?? vi.fn()} board={gameBoard} />);
    this.user = userEvent.setup();
  }

  get components() {
    return {
      board: screen.getByTestId("board"),
      boardCell: screen.getAllByTestId(/board-cell-\d+-\d+/),
    };
  }
}

describe("UI", () => {
  it("should render the components correctly", () => {
    const sut = new Sut();
    expect(sut.components.board).toBeInTheDocument();
    expect(sut.components.boardCell.length).toEqual(
      Math.pow(constants.initialBoardSetup.boardSize, 2)
    );
  });

  it(`should render all the cells as "dead" by default`, () => {
    new Sut();
    for (let i = 0; i < constants.BOARD_SIZE; i++) {
      for (let j = 0; j < constants.BOARD_SIZE; j++) {
        expect(screen.getByTestId(`board-cell-${i}-${j}`)).toHaveClass(
          "bg-slate-50"
        );
      }
    }
  });

  it("should render all the cells with the correct size", () => {
    new Sut();
    for (let i = 0; i < constants.BOARD_SIZE; i++) {
      for (let j = 0; j < constants.BOARD_SIZE; j++) {
        expect(screen.getByTestId(`board-cell-${i}-${j}`)).toHaveClass(
          `w-${constants.BOARD_CELL_SIZE} h-${constants.BOARD_CELL_SIZE}`
        );
      }
    }
  });
});

describe("Turning on and off cell-squares", () => {
  it(`should change the state of a cell correctly from "dead" to "alive"`, () => {
    const cellRow = Math.floor(Math.random() * constants.BOARD_SIZE - 1) + 1;
    const cellColumn = Math.floor(Math.random() * constants.BOARD_SIZE - 1) + 1;
    const onClickCell = vi.fn();
    new Sut(onClickCell);
    fireEvent.click(screen.getByTestId(`board-cell-${cellRow}-${cellColumn}`));
    expect(onClickCell).toHaveBeenCalledOnce();
    expect(onClickCell).toBeCalledWith(cellRow, cellColumn);
  });
});
