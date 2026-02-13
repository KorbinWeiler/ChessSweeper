import type { Ref } from 'vue';
import { ChessBoard } from '../../Model/ChessBoard';
import { ChessTile } from '../../Model/ChessTile';
import { ChessPiece } from '../../Model/ChessPiece';
import { Pawn } from '../../Model/Pieces/Pawn';
import { Rook } from '../../Model/Pieces/Rook';
import { Knight } from '../../Model/Pieces/Knight';
import { Bishop } from '../../Model/Pieces/Bishop';
import { Queen } from '../../Model/Pieces/Queen';
import { King } from '../../Model/Pieces/King';

/**
 * Initialize or reset the chess board with given bomb count
 */
export const initializeBoard = (
  chessBoardRef: Ref<ChessBoard | null>,
  boardRef: Ref<ChessTile[][]>,
  selectedTileRef: Ref<ChessTile | null>,
  validMovesRef: Ref<[number, number][]>,
  currentTurnRef: Ref<'white' | 'black'>,
  numberOfBombs: number = 8
) => {
  chessBoardRef.value = new ChessBoard(numberOfBombs);
  boardRef.value = chessBoardRef.value.board;
  selectedTileRef.value = null;
  validMovesRef.value = [];
  currentTurnRef.value = 'white';
};

/**
 * Get tile color class based on position
 */
export const getTileColor = (row: number, col: number): string => {
  return (row + col) % 2 === 0 ? 'light-tile' : 'dark-tile';
};

/**
 * Check if a tile is currently selected
 */
export const isSelected = (
  selectedTileRef: Ref<ChessTile | null>,
  row: number,
  col: number
): boolean => {
  return selectedTileRef.value?.x === row && selectedTileRef.value?.y === col;
};

/**
 * Check if a tile is a valid move destination
 */
export const isValidMove = (
  validMovesRef: Ref<[number, number][]>,
  row: number,
  col: number
): boolean => {
  return validMovesRef.value.some(([x, y]: [number, number]) => x === row && y === col);
};

/**
 * Calculate valid moves for a piece on a given tile
 */
export const calculateValidMoves = (
  boardRef: Ref<ChessTile[][]>,
  tile: ChessTile
): [number, number][] => {
  if (!tile.piece) return [];

  const moves = tile.piece.calculateMoves(tile.x, tile.y);

  return moves.filter(([x, y]: [number, number]) => {
    if (x < 0 || x >= 8 || y < 0 || y >= 8) return false;
    const rowArr = boardRef.value[x];
    if (!rowArr) return false;
    const targetTile = rowArr[y];
    if (!targetTile) return false;

    const piece = tile.piece!;

    // Pawn-specific rules
    if (piece instanceof Pawn) {
      const dx = x - tile.x;
      const dy = y - tile.y;

      // Forward move (same column)
      if (dy === 0) {
        if (Math.abs(dx) === 1) {
          return !targetTile.piece;
        }
        if (Math.abs(dx) === 2) {
          const step = dx > 0 ? 1 : -1;
          const midRow = tile.x + step;
          const midRowArr = boardRef.value[midRow];
          if (!midRowArr) return false;
          const midTile = midRowArr[tile.y];
          if (!midTile) return false;
          return !midTile.piece && !targetTile.piece;
        }
        return false;
      }

      // Diagonal capture
      if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
        return !!targetTile.piece && targetTile.piece.color !== piece.color;
      }
      return false;
    }

    // Knight can jump over pieces
    if (piece instanceof Knight) {
      return !targetTile.piece || targetTile.piece.color !== piece.color;
    }

    // For sliding pieces (Rook, Bishop, Queen, King), check path is clear
    // King only moves 1 square so path check is not needed, but doesn't hurt
    const dx = Math.sign(x - tile.x);
    const dy = Math.sign(y - tile.y);
    let currentX = tile.x + dx;
    let currentY = tile.y + dy;

    // Check all squares between start and destination
    while (currentX !== x || currentY !== y) {
      const checkRowArr = boardRef.value[currentX];
      if (!checkRowArr) return false;
      const checkTile = checkRowArr[currentY];
      if (!checkTile) return false;
      
      // If there's a piece blocking the path, move is invalid
      if (checkTile.piece) {
        return false;
      }

      currentX += dx;
      currentY += dy;
    }

    // Destination must be empty or contain opponent's piece
    return !targetTile.piece || targetTile.piece.color !== piece.color;
  });
};

/**
 * Execute a chess move (without bomb logic)
 * Returns the destination tile for external processing
 */
export const executeMove = (
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurnRef: Ref<'white' | 'black'>
): ChessTile => {
  // Move the piece
  toTile.piece = fromTile.piece;
  fromTile.piece = null;

  // Mark pawn as moved
  if (toTile.piece instanceof Pawn) {
    (toTile.piece as Pawn).hasMoved = true;
  }

  // Switch turns
  currentTurnRef.value = currentTurnRef.value === 'white' ? 'black' : 'white';

  return toTile;
};

/**
 * Get the Unicode symbol for a chess piece
 */
export const getPieceSymbol = (piece: ChessPiece): string => {
  const isWhite = piece.color === 'white';

  if (piece instanceof King) return isWhite ? '♔' : '♚';
  if (piece instanceof Queen) return isWhite ? '♕' : '♛';
  if (piece instanceof Rook) return isWhite ? '♖' : '♜';
  if (piece instanceof Bishop) return isWhite ? '♗' : '♝';
  if (piece instanceof Knight) return isWhite ? '♘' : '♞';
  if (piece instanceof Pawn) return isWhite ? '♙' : '♟';

  return '?';
};

/**
 * Handle tile click interaction
 */
export const handleTileClick = (
  boardRef: Ref<ChessTile[][]>,
  selectedTileRef: Ref<ChessTile | null>,
  validMovesRef: Ref<[number, number][]>,
  currentTurnRef: Ref<'white' | 'black'>,
  row: number,
  col: number,
  onMoveComplete?: (tile: ChessTile) => void
) => {
  const rowArr = boardRef.value[row];
  if (!rowArr) return;
  const clickedTile = rowArr[col];
  if (!clickedTile) return;

  // Execute move if valid destination
  if (selectedTileRef.value && isValidMove(validMovesRef, row, col)) {
    const destinationTile = executeMove(selectedTileRef.value, clickedTile, currentTurnRef);
    selectedTileRef.value = null;
    validMovesRef.value = [];

    // Call external handler (for bomb logic, animations, etc.)
    if (onMoveComplete) {
      onMoveComplete(destinationTile);
    }
    return;
  }

  // Select piece if it belongs to current player
  if (clickedTile.piece && clickedTile.piece.color === currentTurnRef.value) {
    selectedTileRef.value = clickedTile;
    validMovesRef.value = calculateValidMoves(boardRef, clickedTile);
  } else {
    selectedTileRef.value = null;
    validMovesRef.value = [];
  }
};
