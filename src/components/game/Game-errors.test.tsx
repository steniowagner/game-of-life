import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { BoardSetupContextProvider } from "@/contexts/BoardSetupProvider";
import { board as boardServices } from "@/services";
import { generateInitialBoard } from "@/lib/board";
import { constants } from "@/utils";
import { logger } from "@/lib";

import { Game } from "./Game";

vi.mock("@/services");
vi.mock("@/lib");

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
      game: screen.queryByTestId("game"),
      error: screen.queryByTestId("error-message"),
      resetButton: screen.queryByTestId("reset-button"),
      nextStateButton: screen.queryByTestId("next-state-button"),
      startPlayForeverButton: screen.queryByTestId("start-play-forever-button"),
      advanceUpdatesButton: screen.queryByTestId("advance-updates-button"),
      boardCell: screen.queryAllByTestId(/board-cell-\d+-\d+/),
    };
  }
}

describe("Game component Errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Calling API", () => {
    describe("generate-initial-board", () => {
      describe("Initial render", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("should show the error message correctly when the ok-status is false", async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: false,
          });
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.GENERATE_INITIAL_BOARD
          );
        });

        it(`should show the error message correctly when "generateInitialBoard" throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockRejectedValueOnce(
            {}
          );
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.GENERATE_INITIAL_BOARD
          );
        });

        it(`should call the "logger" when throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockRejectedValueOnce(
            {}
          );
          new Sut();
          await waitFor(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("Resetting the Board", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("should show the error message correctly when the ok-status is false", async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: false,
          });
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.resetButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.GENERATE_INITIAL_BOARD
          );
        });

        it(`should show the error message correctly when "generateInitialBoard" throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.generateInitialBoard as Mock).mockRejectedValueOnce(
            {}
          );
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.resetButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.GENERATE_INITIAL_BOARD
          );
        });

        it(`should call the "logger" when throws an error R`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.generateInitialBoard as Mock).mockRejectedValueOnce(
            {}
          );
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.resetButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          await waitFor(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("compute-next-state", () => {
      describe("Update to next state", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("should show the error message correctly when the ok-status is false", async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.computeNextState as Mock).mockReturnValueOnce({
            ok: false,
          });
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.nextStateButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.UPDATE_NEXT_STATE
          );
        });

        it(`should show the error message correctly when "generateInitialBoard" throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.computeNextState as Mock).mockRejectedValueOnce({});
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.nextStateButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.UPDATE_NEXT_STATE
          );
        });

        it(`should call the "logger" when throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.computeNextState as Mock).mockRejectedValueOnce({});
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.nextStateButton!);
          });
          await waitFor(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("Play forever", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("should show the error message correctly when the ok-status is false", async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.computeNextState as Mock).mockReturnValueOnce({
            ok: false,
          });
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.startPlayForeverButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.PLAY_FOREVER
          );
        });

        it(`should show the error message correctly when "generateInitialBoard" throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.computeNextState as Mock).mockRejectedValueOnce({});
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.startPlayForeverButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.PLAY_FOREVER
          );
        });

        it(`should call the "logger" when throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.computeNextState as Mock).mockRejectedValueOnce({});
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.startPlayForeverButton!);
          });
          await waitFor(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("toggle-cell-state", () => {
      describe("Update Cell state", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("should show the error message correctly when the ok-status is false", async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.toggleCellState as Mock).mockReturnValueOnce({
            ok: false,
          });
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.boardCell[0]);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.UPDATE_CELL_STATE
          );
        });

        it(`should show the error message correctly when "generateInitialBoard" throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.toggleCellState as Mock).mockRejectedValueOnce({});
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.boardCell[0]);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.UPDATE_CELL_STATE
          );
        });

        it(`should call the "logger" when throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.toggleCellState as Mock).mockRejectedValueOnce({});
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.boardCell[0]);
          });
          await waitFor(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("advance-x-state-updates", () => {
      describe("Advance State Updates", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("should show the error message correctly when the ok-status is false", async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.advanceXStateUpdates as Mock).mockReturnValueOnce({
            ok: false,
          });
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.advanceUpdatesButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.ADVANCE_X_STATE_UPDATES
          );
        });

        it(`should show the error message correctly when "generateInitialBoard" throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.advanceXStateUpdates as Mock).mockRejectedValueOnce(
            {}
          );
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.advanceUpdatesButton!);
          });
          await waitFor(() => {
            expect(sut.components.error).toBeInTheDocument();
          });
          expect(sut.components.error?.textContent).toEqual(
            constants.errors.ADVANCE_X_STATE_UPDATES
          );
        });

        it(`should call the "logger" when throws an error`, async () => {
          (boardServices.generateInitialBoard as Mock).mockReturnValueOnce({
            ok: true,
            board: generateInitialBoard(5),
          });
          (boardServices.advanceXStateUpdates as Mock).mockRejectedValueOnce(
            {}
          );
          const sut = new Sut();
          await waitFor(() => {
            expect(sut.components.game).toBeInTheDocument();
          });
          await waitFor(() => {
            fireEvent.click(sut.components.advanceUpdatesButton!);
          });
          await waitFor(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
