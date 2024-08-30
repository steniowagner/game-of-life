import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";

import { BoardSetupContext } from "@/contexts";
import { constants } from "@/utils";

import { SetupBoard } from "./SetupBoard";

class Sut {
  user: UserEvent;

  constructor(changeBoardSetup?: Mock) {
    render(
      <BoardSetupContext.Provider
        value={{
          changeBoardSetup: changeBoardSetup ?? vi.fn(),
          boardSetup: constants.initialBoardSetup,
        }}
      >
        <SetupBoard />
      </BoardSetupContext.Provider>
    );
    this.user = userEvent.setup();
  }

  get components() {
    return {
      advanceUpdatesInput: screen.getByTestId("advance-updates-input"),
      boardSizeInput: screen.getByTestId("board-size-input"),
      playForeverInput: screen.getByTestId("play-forever-input"),
      applyButton: screen.getByTestId("apply-button"),
    };
  }
}

describe("UI", () => {
  it("should render all components", () => {
    const sut = new Sut();
    expect(sut.components.advanceUpdatesInput).toBeInTheDocument();
    expect(sut.components.boardSizeInput).toBeInTheDocument();
    expect(sut.components.playForeverInput).toBeInTheDocument();
    expect(sut.components.applyButton).toBeInTheDocument();
  });

  it("should render the inputs with the default value by default", () => {
    const sut = new Sut();
    expect(sut.components.advanceUpdatesInput).toHaveProperty(
      "value",
      `${constants.initialBoardSetup.advanceXStateUpdates}`
    );
    expect(sut.components.boardSizeInput).toHaveProperty(
      "value",
      `${constants.initialBoardSetup.boardSize}`
    );
    expect(sut.components.playForeverInput).toHaveProperty(
      "value",
      `${constants.initialBoardSetup.playForeverTimeoutMs}`
    );
  });
});

describe("Changing Setup fields", () => {
  it("should apply the setup correctly when the user set different options", async () => {
    const changeBoardSetup = vi.fn();
    const sut = new Sut(changeBoardSetup);
    const advanceXStateUpdates = Math.floor(Math.random() * 10) + 1;
    const boardSize = Math.floor(Math.random() * 10) + 1;
    const playForeverTimeoutMs = Math.floor(Math.random() * 10) + 1;
    await waitFor(() => {
      fireEvent.change(sut.components.advanceUpdatesInput, {
        target: { value: advanceXStateUpdates },
      });
      fireEvent.change(sut.components.boardSizeInput, {
        target: { value: boardSize },
      });
      fireEvent.change(sut.components.playForeverInput, {
        target: { value: playForeverTimeoutMs },
      });
      fireEvent.click(sut.components.applyButton);
    });
    expect(changeBoardSetup).toHaveBeenCalledOnce();
    expect(changeBoardSetup).toBeCalledWith({
      playForeverTimeoutMs,
      advanceXStateUpdates,
      boardSize,
    });
  });
});
