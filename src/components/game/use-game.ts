/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef, useEffect } from "react";

import { BoardCellState, Board as BoardType } from "@/types";
import { board as boardServices } from "@/services";
import { useBoardSetup } from "@/contexts";

export const useGame = () => {
  const [isPlayingForever, setIsPlayingForever] = useState(false);
  const [board, setBoard] = useState<BoardType>([]);

  const playingForeverRef = useRef(isPlayingForever);

  const { boardSetup } = useBoardSetup();

  const updateCellStateManually = useCallback((row: number, column: number) => {
    setBoard((oldBoard) => {
      const boardUpdated = oldBoard.map((row) => row.slice());
      boardUpdated[row][column] =
        boardUpdated[row][column] === BoardCellState.ALIVE
          ? BoardCellState.DEAD
          : BoardCellState.ALIVE;
      return boardUpdated;
    });
  }, []);

  const updateToNextState = useCallback(async () => {
    const boardUpdated = await boardServices.computeNextState(board);
    setBoard(boardUpdated);
    setIsPlayingForever(false);
  }, [board]);

  const advanceStateUpdates = useCallback(async () => {
    const nextBoard = await boardServices.advanceXStateUpdates(
      board,
      boardSetup.advanceXStateUpdates
    );
    setBoard(nextBoard);
  }, [board, boardSetup]);

  const resetBoard = useCallback(async () => {
    const initialBoard = await boardServices.generateInitialBoard(
      boardSetup.boardSize
    );
    setBoard(initialBoard);
    setIsPlayingForever(false);
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
    const loopComputingNextState = async () => {
      if (!playingForeverRef.current) {
        return;
      }
      const nextBoardState = await boardServices.computeNextState(board);
      setBoard(nextBoardState);
      setTimeout(loopComputingNextState, boardSetup.playForeverTimeoutMs);
    };
    loopComputingNextState();
  }, [isPlayingForever]);

  useEffect(() => {
    const resetToInitialBoardState = async () => {
      const initialBoard = await boardServices.generateInitialBoard(
        boardSetup.boardSize
      );
      setBoard(initialBoard);
      setIsPlayingForever(false);
    };
    resetToInitialBoardState();
  }, [boardSetup]);

  return {
    onClickCell: updateCellStateManually,
    onClickPlayForever: togglePlayForever,
    onClickReset: resetBoard,
    onClickNextState: updateToNextState,
    onClickAdvanceStateUpdates: advanceStateUpdates,
    advanceXStateUpdates: boardSetup.advanceXStateUpdates,
    isPlayingForever,
    board,
  };
};
