import type { Ref } from 'vue';
import { ChessTile } from '../../Model/ChessTile';
import { executeMove } from './classicChessLogic';

/**
 * Chessception makeMove: classic chess rules (no bombs)
 */
export const chessceptionMakeMove = (
  board: Ref<ChessTile[][]>,
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurn: Ref<'white' | 'black'>,
  moveMode: string
): void => {
  // Execute standard chess move without bomb logic
  executeMove(fromTile, toTile, currentTurn);
};
