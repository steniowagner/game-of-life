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

type BoardSetupContextProviderProps = {
  children: JSX.Element;
};

export const BoardSetupContext = createContext<BoardSetupContextProps>({
  boardSetup: constants.initialBoardSetup,
  changeBoardSetup: () => {},
});

export const BoardSetupContextProvider = (
  props: BoardSetupContextProviderProps
) => {
  const [boardSetup, setBoardSetup] = useState<BoardSetup>(
    constants.initialBoardSetup
  );

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
