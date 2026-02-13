import type { Ref } from 'vue';
import { ChessTile } from '../../Model/ChessTile';
import { chesssweeperMakeMove } from './bombGameMode';
import { chessceptionMakeMove } from './chessceptionGameMode';
import { shuffleChessMakeMove } from './shuffleChessGameMode';

/**
 * MakeMove function type definition
 */
export type MakeMoveFunction = (
  board: Ref<ChessTile[][]>,
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurn: Ref<'white' | 'black'>,
  moveMode: string
) => void;

/**
 * Available game modes and their respective makeMove functions
 */
// export const gameModes = {
//   chesssweeper: chesssweeperMakeMove,
//   chessception: chessceptionMakeMove,
//   shuffleChess: shuffleChessMakeMove
// } as const;

// Export individual makeMove functions
export { chesssweeperMakeMove, chessceptionMakeMove, shuffleChessMakeMove };
