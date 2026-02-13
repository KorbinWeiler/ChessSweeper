<template>
  <v-container class="chessboard-container" fluid>
    <v-row align="start" justify="center">
      <v-col cols="auto">
        <v-sheet class="chessboard" elevation="6">
          <div 
            v-for="(row, rowIndex) in board" 
            :key="rowIndex" 
            class="chess-row"
          >
            <div
              v-for="(tile, colIndex) in row"
              :key="rowIndex + '-' + colIndex"
              class="chess-tile"
              :class="[
                getTileColor(rowIndex, colIndex),
                { 'selected': isSelected(rowIndex, colIndex) },
                { 'valid-move': isValidMove(rowIndex, colIndex) }
              ]"
              @click="handleTileClick(rowIndex, colIndex)"
            >
              <div v-if="tile.piece" class="chess-piece" :class="'piece-' + tile.piece.color">
                {{ getPieceSymbol(tile.piece) }}
              </div>

              <div v-if="tile.bomb && !tile.bomb.isActive" class="bomb-indicator">💣</div>

              <div v-if="isValidMove(rowIndex, colIndex) && !tile.piece" class="move-dot"></div>
            </div>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="auto">
        <v-card class="game-info" elevation="4">
          <v-card-title>
            <v-chip :color="currentTurn === 'white' ? 'grey lighten-4' : 'grey darken-3'" text-color="black">
              {{ currentTurn === 'white' ? '⚪ White' : '⚫ Black' }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div v-if="selectedTile">Selected: ({{ selectedTile.x }}, {{ selectedTile.y }})</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="resetBoard">Reset Board</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChessBoard } from '../../Model/ChessBoard';
import { ChessTile } from '../../Model/ChessTile';
import { ChessPiece } from '../../Model/ChessPiece';
import { Pawn } from '../../Model/Pieces/Pawn';
import { Rook } from '../../Model/Pieces/Rook';
import { Knight } from '../../Model/Pieces/Knight';
import { Bishop } from '../../Model/Pieces/Bishop';
import { Queen } from '../../Model/Pieces/Queen';
import { King } from '../../Model/Pieces/King';

const chessBoard = ref<ChessBoard | null>(null);
const board = ref<ChessTile[][]>([]);
const selectedTile = ref<ChessTile | null>(null);
const validMoves = ref<[number, number][]>([]);
const currentTurn = ref<'white' | 'black'>('white');

onMounted(() => {
  initializeBoard();
});

const initializeBoard = () => {
  chessBoard.value = new ChessBoard();
  board.value = chessBoard.value.board;
  selectedTile.value = null;
  validMoves.value = [];
  currentTurn.value = 'white';
};

const resetBoard = () => {
  initializeBoard();
};

const getTileColor = (row: number, col: number): string => {
  return (row + col) % 2 === 0 ? 'light-tile' : 'dark-tile';
};

const isSelected = (row: number, col: number): boolean => {
  return selectedTile.value?.x === row && selectedTile.value?.y === col;
};

const isValidMove = (row: number, col: number): boolean => {
  return validMoves.value.some(([x, y]: [number, number]) => x === row && y === col);
};

const handleTileClick = (row: number, col: number) => {
  const rowArr = board.value[row];
  if (!rowArr) return;
  const clickedTile = rowArr[col];
  if (!clickedTile) return;

  // If a tile is already selected and we click on a valid move
  if (selectedTile.value && isValidMove(row, col)) {
    movePiece(selectedTile.value!, clickedTile);
    selectedTile.value = null;
    validMoves.value = [];
    return;
  }

  // If clicking on a piece of the current player's color
  if (clickedTile.piece && clickedTile.piece.color === currentTurn.value) {
    selectedTile.value = clickedTile;
    validMoves.value = calculateValidMoves(clickedTile);
  } else {
    selectedTile.value = null;
    validMoves.value = [];
  }
};

const calculateValidMoves = (tile: ChessTile): [number, number][] => {
  if (!tile.piece) return [];
  
  const moves = tile.piece.calculateMoves(tile.x, tile.y);
  // Filter moves to be within board bounds and apply pawn-specific rules
  return moves.filter(([x, y]: [number, number]) => {
    if (x < 0 || x >= 8 || y < 0 || y >= 8) return false;
    const rowArr = board.value[x];
    if (!rowArr) return false;
    const targetTile = rowArr[y];
    if (!targetTile) return false;

    const piece = tile.piece!;
    // Pawn-specific rules: forward moves must be to empty squares; captures diagonal only
    if (piece instanceof Pawn) {
      const dx = x - tile.x; // change in row
      const dy = y - tile.y; // change in col
      // Forward move (same column)
      if (dy === 0) {
        // single-step
        if (Math.abs(dx) === 1) {
          return !targetTile.piece;
        }
        // two-step: ensure intermediate square and target are empty
        if (Math.abs(dx) === 2) {
          const step = dx > 0 ? 1 : -1;
          const midRow = tile.x + step;
          const midRowArr = board.value[midRow];
          if (!midRowArr) return false;
          const midTile = midRowArr[tile.y];
          if (!midTile) return false;
          return !midTile.piece && !targetTile.piece;
        }
        return false;
      }
      // Diagonal capture (one forward, one sideways)
      if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
        return !!targetTile.piece && targetTile.piece.color !== piece.color;
      }
      return false;
    }

    // Default: can't move to a tile occupied by own piece
    return !targetTile.piece || targetTile.piece.color !== piece.color;
  });
};

const movePiece = (fromTile: ChessTile, toTile: ChessTile) => {
  // Move the piece
  toTile.piece = fromTile.piece;
  fromTile.piece = null;
  // If the moved piece is a pawn, mark it as having moved
  if (toTile.piece instanceof Pawn) {
    (toTile.piece as Pawn).hasMoved = true;
  }
  
  // Check if there's a bomb
  if (toTile.bomb) {
    const detonated = toTile.bomb.detonate();
    if (detonated) {
      //remove piece from toTile
      toTile.piece = null;
    }
  }
  
  // Switch turns
  currentTurn.value = currentTurn.value === 'white' ? 'black' : 'white';
};

const getPieceSymbol = (piece: ChessPiece): string => {
  const isWhite = piece.color === 'white';
  
  if (piece instanceof King) return isWhite ? '♔' : '♚';
  if (piece instanceof Queen) return isWhite ? '♕' : '♛';
  if (piece instanceof Rook) return isWhite ? '♖' : '♜';
  if (piece instanceof Bishop) return isWhite ? '♗' : '♝';
  if (piece instanceof Knight) return isWhite ? '♘' : '♞';
  if (piece instanceof Pawn) return isWhite ? '♙' : '♟';
  
  return '?';
};
</script>

<style scoped>
.chessboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.chessboard {
  display: flex;
  flex-direction: column;
  border: 4px solid #2d3748;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.chess-row {
  display: flex;
}

.chess-tile {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.light-tile {
  background-color: #f0d9b5;
}

.dark-tile {
  background-color: #b58863;
}

.chess-tile:hover {
  filter: brightness(0.9);
}

.chess-tile.selected {
  background-color: #7fc97f !important;
  box-shadow: inset 0 0 0 3px #4a9d4a;
}

.chess-tile.valid-move {
  background-color: #a8e6cf !important;
}

.chess-piece {
  font-size: 48px;
  user-select: none;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.chess-piece:hover {
  transform: scale(1.1);
}

.piece-white {
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3));
}

.piece-black {
  filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 0.2));
}

.bomb-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  animation: pulse 1s infinite;
}

.move-dot {
  width: 20px;
  height: 20px;
  background-color: rgba(127, 201, 127, 0.6);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.game-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
}

.game-info h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.reset-button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.reset-button:active {
  transform: translateY(0);
}
</style>
