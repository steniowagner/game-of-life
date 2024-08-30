/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";

import { useBoardSetup } from "@/contexts";
import { constants } from "@/utils";

export const useSetupBoard = () => {
  const [playForeverTimeoutMs, setPlayForeverTimeoutMs] = useState(
    constants.PLAY_FOREVER_TIMEOUT_MS
  );
  const [boardSize, setBoardSize] = useState(constants.BOARD_SIZE);
  const [advanceXStateUpdates, setAdvanceXStateUpdates] = useState(
    constants.ADVANCE_X_STATE_UPDATES
  );

  const boardSetup = useBoardSetup();

  const applySetupChanges = useCallback(() => {
    boardSetup.changeBoardSetup({
      playForeverTimeoutMs,
      advanceXStateUpdates,
      boardSize,
    });
  }, [playForeverTimeoutMs, boardSize, advanceXStateUpdates]);

  return {
    changePlayForeverTimeoutMs: setPlayForeverTimeoutMs,
    changeAdvanceXStateUpdates: setAdvanceXStateUpdates,
    changeBoardSize: setBoardSize,
    onClickApply: applySetupChanges,
    playForeverTimeoutMs,
    advanceXStateUpdates,
    boardSize,
  };
};
