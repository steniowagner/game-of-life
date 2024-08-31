import userEvent, { UserEvent } from "@testing-library/user-event";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BoardSetupContextProvider } from "@/contexts/BoardSetupProvider";
import { constants } from "@/utils";

import { Game } from "./Game";

class Sut {
  user: UserEvent;

  constructor() {
    render(
      <BoardSetupContextProvider>
        <Game />
      </BoardSetupContextProvider>
    );
    this.user = userEvent.setup();
  }

  get components() {
    return {
      game: screen.getByTestId("game"),
      setupBoard: screen.getByTestId("setup-board"),
      board: screen.getByTestId("board"),
      boardCell: screen.getAllByTestId(/board-cell-\d+-\d+/),
      advanceUpdatesInput: screen.getByTestId("advance-updates-input"),
      boardSizeInput: screen.getByTestId("board-size-input"),
      playForeverInput: screen.getByTestId("play-forever-input"),
      applyButton: screen.getByTestId("apply-button"),
      error: screen.queryByTestId("error-message"),
      nextStateButton: screen.getByTestId("next-state-button"),
      startPlayForeverButton: screen.getByTestId("start-play-forever-button"),
      advanceUpdatesButton: screen.getByTestId("advance-updates-button"),
      resetButton: screen.getByTestId("reset-button"),
    };
  }
}

describe("Game component", () => {
  describe("UI", () => {
    it("should render all components correctly", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      expect(sut.components.setupBoard).toBeInTheDocument();
      expect(sut.components.board).toBeInTheDocument();
      expect(sut.components.nextStateButton).toBeInTheDocument();
      expect(sut.components.startPlayForeverButton).toBeInTheDocument();
      expect(sut.components.advanceUpdatesButton).toBeInTheDocument();
      expect(sut.components.error).not.toBeInTheDocument();
    });

    it(`should resize the board when the users sets the "Board size"`, async () => {
      const boardSize = Math.floor(Math.random() * 10) + 1;
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      expect(sut.components.boardCell.length).toEqual(
        Math.pow(constants.initialBoardSetup.boardSize, 2)
      );
      await waitFor(() => {
        fireEvent.change(sut.components.boardSizeInput, {
          target: { value: boardSize },
        });
        fireEvent.click(sut.components.applyButton);
      });
      expect(sut.components.boardCell.length).toEqual(Math.pow(boardSize, 2));
    });

    it(`should change the "Advance update" button label correctly when the user sets the "Advance updates"`, async () => {
      const advanceUpdates = Math.floor(Math.random() * 10) + 1;
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      expect(sut.components.advanceUpdatesButton).toHaveTextContent(
        `Advance ${constants.ADVANCE_X_STATE_UPDATES} update`
      );
      await waitFor(() => {
        fireEvent.change(sut.components.advanceUpdatesInput, {
          target: { value: advanceUpdates },
        });
        fireEvent.click(sut.components.applyButton);
      });
      expect(sut.components.advanceUpdatesButton).toHaveTextContent(
        `Advance ${
          advanceUpdates === 1 ? "1 update" : `${advanceUpdates} updates`
        }`
      );
    });
  });

  describe("Turning on and off cells", () => {
    it(`should change the cell-state from "dead" to "alive" correctly`, async () => {
      const cellRow = Math.floor(Math.random() * constants.BOARD_SIZE - 1) + 1;
      const cellColumn =
        Math.floor(Math.random() * constants.BOARD_SIZE - 1) + 1;
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      const cell = screen.getByTestId(`board-cell-${cellRow}-${cellColumn}`);
      expect(cell).toHaveClass("bg-slate-50");
      expect(cell).not.toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(cell);
      });
      expect(cell).toHaveClass("bg-red-500");
      expect(cell).not.toHaveClass("bg-slate-50");
    });

    it(`should change the cell-state from "alive" to "dead" correctly`, async () => {
      const cellRow = Math.floor(Math.random() * constants.BOARD_SIZE - 1) + 1;
      const cellColumn =
        Math.floor(Math.random() * constants.BOARD_SIZE - 1) + 1;
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      const cell = screen.getByTestId(`board-cell-${cellRow}-${cellColumn}`);
      await waitFor(() => {
        fireEvent.click(cell);
      });
      expect(cell).toHaveClass("bg-red-500");
      expect(cell).not.toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(cell);
      });
      expect(cell).toHaveClass("bg-slate-50");
      expect(cell).not.toHaveClass("bg-red-500");
    });
  });

  describe("Advancing to the next state", () => {
    it(`should advance to the next state when the user clicks in the "Next State" button`, async () => {
      /**
       * Pattern: Blinker (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#/media/File:Game_of_life_blinker.gif)
       */
      const firstCellCoordinates = [3, 0];
      const secondCellCoordinates = [3, 1];
      const thirdCellCoordinates = [3, 2];
      const firstCellUpdatedCoordinates = [2, 1];
      const secondCellUpdatedCoordinates = [3, 1];
      const thirdCellUpdatedCoordinates = [4, 1];
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      const firstCell = screen.getByTestId(
        `board-cell-${firstCellCoordinates[0]}-${firstCellCoordinates[1]}`
      );
      const firstCellAfterUpdate = screen.getByTestId(
        `board-cell-${firstCellUpdatedCoordinates[0]}-${firstCellUpdatedCoordinates[1]}`
      );
      const secondCell = screen.getByTestId(
        `board-cell-${secondCellCoordinates[0]}-${secondCellCoordinates[1]}`
      );
      const secondCellAfterUpdate = screen.getByTestId(
        `board-cell-${secondCellUpdatedCoordinates[0]}-${secondCellUpdatedCoordinates[1]}`
      );
      const thirdCell = screen.getByTestId(
        `board-cell-${thirdCellCoordinates[0]}-${thirdCellCoordinates[1]}`
      );
      const thirdCellAfterUpdate = screen.getByTestId(
        `board-cell-${thirdCellUpdatedCoordinates[0]}-${thirdCellUpdatedCoordinates[1]}`
      );
      await waitFor(() => {
        fireEvent.click(firstCell);
      });
      expect(firstCell).toHaveClass("bg-red-500");
      expect(firstCellAfterUpdate).toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(secondCell);
      });
      expect(secondCell).toHaveClass("bg-red-500");
      expect(secondCellAfterUpdate).toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(thirdCell);
      });
      expect(thirdCell).toHaveClass("bg-red-500");
      expect(thirdCellAfterUpdate).toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(sut.components.nextStateButton);
      });
      expect(firstCell).toHaveClass("bg-slate-50");
      expect(firstCellAfterUpdate).toHaveClass("bg-red-500");
      expect(secondCell).toHaveClass("bg-red-500");
      expect(secondCellAfterUpdate).toHaveClass("bg-red-500");
      expect(thirdCell).toHaveClass("bg-slate-50");
      expect(thirdCellAfterUpdate).toHaveClass("bg-red-500");
    });
  });

  describe("Playing forever the next state", () => {
    beforeEach(() => {
      vi.clearAllTimers();
    });

    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it(`should keep the board updating forever when the user clicks in the "Start Play Forever" button`, async () => {
      /**
       * Pattern: Glider (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#/media/File:Game_of_life_animated_glider.gif)
       */
      const firstCellCoordinates = [0, 2];
      const secondCellCoordinates = [1, 0];
      const thirdCellCoordinates = [1, 2];
      const fourthCellCoordinates = [2, 1];
      const fifthCellCoordinates = [2, 2];
      userEvent.setup({
        advanceTimers: (ms) => vi.advanceTimersByTime(ms),
      });
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      const firstCell = screen.getByTestId(
        `board-cell-${firstCellCoordinates[0]}-${firstCellCoordinates[1]}`
      );
      const secondCell = screen.getByTestId(
        `board-cell-${secondCellCoordinates[0]}-${secondCellCoordinates[1]}`
      );
      const thirdCell = screen.getByTestId(
        `board-cell-${thirdCellCoordinates[0]}-${thirdCellCoordinates[1]}`
      );
      const fourthCell = screen.getByTestId(
        `board-cell-${fourthCellCoordinates[0]}-${fourthCellCoordinates[1]}`
      );
      const fifthCell = screen.getByTestId(
        `board-cell-${fifthCellCoordinates[0]}-${fifthCellCoordinates[1]}`
      );
      await waitFor(() => {
        fireEvent.click(firstCell);
      });
      await waitFor(() => {
        fireEvent.click(secondCell);
      });
      await waitFor(() => {
        fireEvent.click(thirdCell);
      });
      await waitFor(() => {
        fireEvent.click(fourthCell);
      });
      await waitFor(() => {
        fireEvent.click(fifthCell);
      });
      expect(firstCell).toHaveClass("bg-red-500");
      expect(secondCell).toHaveClass("bg-red-500");
      expect(thirdCell).toHaveClass("bg-red-500");
      expect(fourthCell).toHaveClass("bg-red-500");
      expect(fifthCell).toHaveClass("bg-red-500");
      act(() => {
        fireEvent.click(sut.components.startPlayForeverButton);
      });
      // ----------- First update -----------
      await act(() => vi.runAllTimers());
      // Previous State
      expect(firstCell).toHaveClass("bg-slate-50");
      expect(secondCell).toHaveClass("bg-slate-50");
      expect(thirdCell).toHaveClass("bg-red-500");
      expect(fourthCell).toHaveClass("bg-red-500");
      expect(fifthCell).toHaveClass("bg-red-500");
      // New State
      expect(screen.getByTestId(`board-cell-0-1`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-1-2`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-1-3`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-1`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-2`)).toHaveClass("bg-red-500");
      // ----------- Second update -----------
      await act(() => vi.runAllTimers());
      // Previous State
      expect(screen.getByTestId(`board-cell-0-1`)).toHaveClass("bg-slate-50");
      expect(screen.getByTestId(`board-cell-1-2`)).toHaveClass("bg-slate-50");
      expect(screen.getByTestId(`board-cell-1-3`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-1`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-2`)).toHaveClass("bg-red-500");
      // New State
      expect(screen.getByTestId(`board-cell-0-2`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-1-3`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-1`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-2`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-3`)).toHaveClass("bg-red-500");
      // ----------- Third update -----------
      await act(() => vi.runAllTimers());
      // Previous State
      expect(screen.getByTestId(`board-cell-0-2`)).toHaveClass("bg-slate-50");
      expect(screen.getByTestId(`board-cell-1-3`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-1`)).toHaveClass("bg-slate-50");
      expect(screen.getByTestId(`board-cell-2-2`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-3`)).toHaveClass("bg-red-500");
      // New State
      expect(screen.getByTestId(`board-cell-1-1`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-1-3`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-2`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-2-3`)).toHaveClass("bg-red-500");
      expect(screen.getByTestId(`board-cell-3-2`)).toHaveClass("bg-red-500");
    });
  });

  describe("Advancing X number of states", () => {
    it(`should advance to the next state when the user clicks in the "Next State" button`, async () => {
      /**
       * Pattern: Toad (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#/media/File:Game_of_life_toad.gif)
       */
      const firstCellCoordinates = [2, 1];
      const secondCellCoordinates = [2, 2];
      const thirdCellCoordinates = [2, 3];
      const fourthCellCoordinates = [3, 0];
      const fifthCellCoordinates = [3, 1];
      const sixthCellCoordinates = [3, 2];
      const firstCellUpdatedCoordinates = [1, 2];
      const secondCellUpdatedCoordinates = [2, 0];
      const thirdCellUpdatedCoordinates = [2, 3];
      const fourthCellUpdatedCoordinates = [3, 0];
      const fifthCellUpdatedCoordinates = [3, 3];
      const sixthCellUpdatedCoordinates = [4, 1];

      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      const firstCell = screen.getByTestId(
        `board-cell-${firstCellCoordinates[0]}-${firstCellCoordinates[1]}`
      );
      const firstCellAfterUpdate = screen.getByTestId(
        `board-cell-${firstCellUpdatedCoordinates[0]}-${firstCellUpdatedCoordinates[1]}`
      );
      const secondCell = screen.getByTestId(
        `board-cell-${secondCellCoordinates[0]}-${secondCellCoordinates[1]}`
      );
      const secondCellAfterUpdate = screen.getByTestId(
        `board-cell-${secondCellUpdatedCoordinates[0]}-${secondCellUpdatedCoordinates[1]}`
      );
      const thirdCell = screen.getByTestId(
        `board-cell-${thirdCellCoordinates[0]}-${thirdCellCoordinates[1]}`
      );
      const thirdCellAfterUpdate = screen.getByTestId(
        `board-cell-${thirdCellUpdatedCoordinates[0]}-${thirdCellUpdatedCoordinates[1]}`
      );
      const fourthCell = screen.getByTestId(
        `board-cell-${fourthCellCoordinates[0]}-${fourthCellCoordinates[1]}`
      );
      const fourthCellAfterUpdate = screen.getByTestId(
        `board-cell-${fourthCellUpdatedCoordinates[0]}-${fourthCellUpdatedCoordinates[1]}`
      );
      const fifthCell = screen.getByTestId(
        `board-cell-${fifthCellCoordinates[0]}-${fifthCellCoordinates[1]}`
      );
      const fifthCellAfterUpdate = screen.getByTestId(
        `board-cell-${fifthCellUpdatedCoordinates[0]}-${fifthCellUpdatedCoordinates[1]}`
      );
      const sixthCell = screen.getByTestId(
        `board-cell-${sixthCellCoordinates[0]}-${sixthCellCoordinates[1]}`
      );
      const sixthCellAfterUpdate = screen.getByTestId(
        `board-cell-${sixthCellUpdatedCoordinates[0]}-${sixthCellUpdatedCoordinates[1]}`
      );
      await waitFor(() => {
        fireEvent.click(firstCell);
      });
      expect(firstCell).toHaveClass("bg-red-500");
      expect(firstCellAfterUpdate).toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(secondCell);
      });
      expect(secondCell).toHaveClass("bg-red-500");
      expect(secondCellAfterUpdate).toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(thirdCell);
      });
      expect(thirdCell).toHaveClass("bg-red-500");
      expect(thirdCellAfterUpdate).toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(fourthCell);
      });
      expect(fourthCell).toHaveClass("bg-red-500");
      expect(fourthCellAfterUpdate).toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(fifthCell);
      });
      expect(fifthCell).toHaveClass("bg-red-500");
      expect(fifthCellAfterUpdate).toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(sixthCell);
      });
      expect(sixthCell).toHaveClass("bg-red-500");
      expect(sixthCellAfterUpdate).toHaveClass("bg-slate-50");
      await waitFor(() => {
        fireEvent.click(sut.components.advanceUpdatesButton);
      });
      expect(firstCell).toHaveClass("bg-slate-50");
      expect(firstCellAfterUpdate).toHaveClass("bg-red-500");
      expect(secondCell).toHaveClass("bg-slate-50");
      expect(secondCellAfterUpdate).toHaveClass("bg-red-500");
      expect(thirdCell).toHaveClass("bg-red-500");
      expect(thirdCellAfterUpdate).toHaveClass("bg-red-500");
      expect(fourthCell).toHaveClass("bg-red-500");
      expect(fourthCellAfterUpdate).toHaveClass("bg-red-500");
      expect(fifthCell).toHaveClass("bg-slate-50");
      expect(fifthCellAfterUpdate).toHaveClass("bg-red-500");
      expect(sixthCell).toHaveClass("bg-slate-50");
      expect(sixthCellAfterUpdate).toHaveClass("bg-red-500");
    });
  });

  describe("Resetting the board", () => {
    it(`should reset the board correctly when the user clicks in the "Rest" button`, async () => {
      // Not generating random coordinates here to avoid generate the same position for two different cells
      // It would cause a selection and then an unselection of the cell
      const firstCellCoordinates = [0, 1];
      const secondCellCoordinates = [2, 3];
      const thirdCellCoordinates = [5, 5];
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.game).toBeInTheDocument();
      });
      const firstCell = screen.getByTestId(
        `board-cell-${firstCellCoordinates[0]}-${firstCellCoordinates[1]}`
      );
      const secondCell = screen.getByTestId(
        `board-cell-${secondCellCoordinates[0]}-${secondCellCoordinates[1]}`
      );
      const thirdCell = screen.getByTestId(
        `board-cell-${thirdCellCoordinates[0]}-${thirdCellCoordinates[1]}`
      );
      await waitFor(() => {
        fireEvent.click(firstCell);
      });
      expect(firstCell).toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(secondCell);
      });
      expect(secondCell).toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(thirdCell);
      });
      expect(thirdCell).toHaveClass("bg-red-500");
      await waitFor(() => {
        fireEvent.click(sut.components.resetButton);
      });
      for (let i = 0; i < constants.BOARD_SIZE; i++) {
        for (let j = 0; j < constants.BOARD_SIZE; j++) {
          expect(screen.getByTestId(`board-cell-${i}-${j}`)).toHaveClass(
            "bg-slate-50"
          );
        }
      }
    });
  });
});
