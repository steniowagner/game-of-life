/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef, useEffect } from "react";

import { board as boardServices } from "@/services";
import { Board as BoardType } from "@/types";
import { useBoardSetup } from "@/contexts";
import { constants } from "@/utils";
import { logger } from "@/lib";

export const useGame = () => {
  const [isPlayingForever, setIsPlayingForever] = useState(false);
  const [board, setBoard] = useState<BoardType>([]);
  const [error, setError] = useState("");

  const playingForeverRef = useRef(isPlayingForever);

  const { boardSetup } = useBoardSetup();

  const updateCellState = useCallback(
    async (row: number, column: number) => {
      try {
        const response = await boardServices.toggleCellState({
          board,
          row,
          column,
        });
        if (!response.ok) {
          return setError(constants.errors.UPDATE_CELL_STATE);
        }
        setBoard(response.board);
      } catch (err: unknown) {
        setError(constants.errors.UPDATE_CELL_STATE);
        logger.error(err);
      }
    },
    [board]
  );

  const updateToNextState = useCallback(async () => {
    try {
      const response = await boardServices.computeNextState(board);
      if (!response.ok) {
        return setError(constants.errors.UPDATE_NEXT_STATE);
      }
      setBoard(response.board);
      setIsPlayingForever(false);
    } catch (err) {
      setError(constants.errors.UPDATE_NEXT_STATE);
      logger.error(err);
    }
  }, [board]);

  const advanceStateUpdates = useCallback(async () => {
    try {
      const response = await boardServices.advanceXStateUpdates(
        board,
        boardSetup.advanceXStateUpdates
      );
      if (!response.ok) {
        return setError(constants.errors.ADVANCE_X_STATE_UPDATES);
      }
      setBoard(response.board);
    } catch (err) {
      setError(constants.errors.ADVANCE_X_STATE_UPDATES);
      logger.error(err);
    }
  }, [board, boardSetup]);

  const resetBoard = useCallback(async () => {
    try {
      const response = await boardServices.generateInitialBoard(
        boardSetup.boardSize
      );
      if (!response.ok) {
        return setError(constants.errors.GENERATE_INITIAL_BOARD);
      }
      setBoard(response.board);
      setIsPlayingForever(false);
    } catch (err) {
      setError(constants.errors.GENERATE_INITIAL_BOARD);
      logger.error(err);
    }
  }, [boardSetup.boardSize]);

  const togglePlayForever = useCallback(() => {
    setIsPlayingForever((isPlayingForever) => !isPlayingForever);
  }, []);

  useEffect(() => {
    playingForeverRef.current = isPlayingForever;
  }, [isPlayingForever]);

  useEffect(() => {
    if (!isPlayingForever) {
      return;
    }
    const loopComputingNextState = async (board: BoardType) => {
      try {
        if (!playingForeverRef.current) {
          return;
        }
        const response = await boardServices.computeNextState(board);
        if (!response.ok) {
          return setError(constants.errors.PLAY_FOREVER);
        }
        setBoard(response.board);
        setTimeout(
          () => loopComputingNextState(response.board),
          boardSetup.playForeverTimeoutMs
        );
      } catch (err) {
        setError(constants.errors.PLAY_FOREVER);
        logger.error(err);
      }
    };
    loopComputingNextState(board);
  }, [isPlayingForever]);

  useEffect(() => {
    const resetToInitialBoardState = async () => {
      try {
        const response = await boardServices.generateInitialBoard(
          boardSetup.boardSize
        );
        if (!response.ok) {
          return setError(constants.errors.GENERATE_INITIAL_BOARD);
        }
        setBoard(response.board);
        setIsPlayingForever(false);
      } catch (err) {
        setError(constants.errors.GENERATE_INITIAL_BOARD);
        logger.error(err);
      }
    };
    resetToInitialBoardState();
  }, [boardSetup]);

  return {
    onClickCell: updateCellState,
    onClickPlayForever: togglePlayForever,
    onClickReset: resetBoard,
    onClickNextState: updateToNextState,
    onClickAdvanceStateUpdates: advanceStateUpdates,
    advanceXStateUpdates: boardSetup.advanceXStateUpdates,
    isPlayingForever,
    error,
    board,
  };
};
