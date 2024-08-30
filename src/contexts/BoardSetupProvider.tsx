import { createContext, useCallback, useContext, useState } from "react";

import { constants } from "@/utils";

type BoardSetup = {
  playForeverTimeoutMs: number;
  advanceXStateUpdates: number;
  boardSize: number;
};

type BoardSetupContextProps = {
  changeBoardSetup: (boardSetup: BoardSetup) => void;
  boardSetup: BoardSetup;
};

const INITIAL_BOARD_SETUP = {
  playForeverTimeoutMs: constants.PLAY_FOREVER_TIMEOUT_MS,
  advanceXStateUpdates: constants.ADVANCE_X_STATE_UPDATES,
  boardSize: constants.BOARD_SIZE,
};

type BoardSetupContextProviderProps = {
  children: JSX.Element;
};

const BoardSetupContext = createContext<BoardSetupContextProps>({
  boardSetup: INITIAL_BOARD_SETUP,
  changeBoardSetup: () => {},
});

export const BoardSetupContextProvider = (
  props: BoardSetupContextProviderProps
) => {
  const [boardSetup, setBoardSetup] = useState<BoardSetup>(INITIAL_BOARD_SETUP);

  const changeBoardSetup = useCallback((boardSetup: BoardSetup) => {
    setBoardSetup(boardSetup);
  }, []);

  return (
    <BoardSetupContext.Provider
      value={{
        changeBoardSetup,
        boardSetup,
      }}
    >
      {props.children}
    </BoardSetupContext.Provider>
  );
};

export const useBoardSetup = () => useContext(BoardSetupContext);

export default BoardSetupContext;
