import type { Ref } from 'vue';
import { ChessTile } from '../../Model/ChessTile';
import { executeMove } from './classicChessLogic';

/**
 * Shuffle Chess makeMove: classic chess rules (no bombs)
 */
export const shuffleChessMakeMove = (
  board: Ref<ChessTile[][]>,
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurn: Ref<'white' | 'black'>,
  moveMode: string
): void => {
  // Execute standard chess move without bomb logic
  executeMove(fromTile, toTile, currentTurn);
};
