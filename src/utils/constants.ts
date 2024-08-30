const PLAY_FOREVER_TIMEOUT_MS = 500;
const BOARD_SIZE = 12;
const ADVANCE_X_STATE_UPDATES = 1;

export const constants = {
  PLAY_FOREVER_TIMEOUT_MS,
  BOARD_SIZE: 12,
  ADVANCE_X_STATE_UPDATES: 1,
  BOARD_CELL_SIZE: 8,
  BOARD_TEMPLATE_COLUMNS_SIZE: "2rem",
  errors: {
    UPDATE_CELL_STATE: "Failed to update cell state.",
    UPDATE_NEXT_STATE: "Failed to update to next state.",
    ADVANCE_X_STATE_UPDATES: "Failed to advance state updates.",
    GENERATE_INITIAL_BOARD: "Failed to generate the initial board.",
    PLAY_FOREVER: "Failed to play forever.",
  },
  initialBoardSetup: {
    playForeverTimeoutMs: PLAY_FOREVER_TIMEOUT_MS,
    advanceXStateUpdates: ADVANCE_X_STATE_UPDATES,
    boardSize: BOARD_SIZE,
  },
};
