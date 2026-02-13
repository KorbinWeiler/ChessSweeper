import type { Ref } from 'vue';
import { ChessTile } from '../../Model/ChessTile';
import { Knight } from '../../Model/Pieces/Knight';
import { executeMove } from './classicChessLogic';

/**
 * Handle bomb detonation after a piece moves to a tile
 * Returns true if the piece was destroyed by the bomb
 */
export const handleBombDetonation = (tile: ChessTile): boolean => {
  if (tile.bomb) {
    const detonated = tile.bomb.detonate();
    if (detonated) {
      // Remove the piece from the tile
      tile.piece = null;
      return true;
    }
  }
  return false;
};

/**
 * Check if a tile should show bomb indicator
 * Always shows exploded bombs; shows active bombs only if showBombIndicator is true
 */
export const shouldShowBombIndicator = (
  tile: ChessTile,
  showBombIndicator: boolean
): boolean => {
  if (!tile.bomb) return false;
  
  // Always show exploded bombs (to indicate what happened)
  if (!tile.bomb.isActive) return true;
  
  // Show active bombs only if indicator setting is enabled
  return showBombIndicator;
};

/**
 * Get vicinity bomb count for a tile
 */
export const getVicinityBombCount = (tile: ChessTile): number => {
  return tile.vicinityBombs || 0;
};

/**
 * Find the first bomb along a path from source to destination
 * Returns the tile where the piece should stop (either first bomb or destination)
 */
export const findFirstBombOnPath = (
  board: ChessTile[][],
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): ChessTile => {
  const dx = Math.sign(toX - fromX);
  const dy = Math.sign(toY - fromY);
  let currentX = fromX + dx;
  let currentY = fromY + dy;

  // Check each tile along the path
  while (currentX !== toX || currentY !== toY) {
    const rowArr = board[currentX];
    if (rowArr) {
      const currentTile = rowArr[currentY];
      if (currentTile?.bomb?.isActive) {
        // Found a bomb, return this tile
        return currentTile;
      }
    }
    currentX += dx;
    currentY += dy;
  }

  // No bomb found, return destination tile
  return board[toX]![toY]!;
};

/**
 * ChessSweeper makeMove: handles bomb detonation and slide mode
 */
export const chesssweeperMakeMove = (
  board: Ref<ChessTile[][]>,
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurn: Ref<'white' | 'black'>,
  moveMode: string
): void => {
  let destinationTile = toTile;

  // For slide mode, check if there's a bomb along the path (except for knights)
  if (moveMode === 'slide' && fromTile.piece && !(fromTile.piece instanceof Knight)) {
    destinationTile = findFirstBombOnPath(
      board.value,
      fromTile.x,
      fromTile.y,
      toTile.x,
      toTile.y
    );
  }

  // Execute the move to the (possibly adjusted) destination
  const finalTile = executeMove(fromTile, destinationTile, currentTurn);

  // Handle bomb detonation
  const exploded = handleBombDetonation(finalTile);
  
  // Force reactivity by replacing the entire board with a deep copy
  if (exploded) {
    board.value = board.value.map(row => [...row]);
  }
};
