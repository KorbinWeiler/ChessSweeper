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

              <div v-if="shouldShowBomb(tile)" class="bomb-indicator" :class="{ 'exploded': tile.bomb && !tile.bomb.isActive }">💣</div>

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
import type { Ref } from 'vue';
import { ref, onMounted, triggerRef } from 'vue';
import { ChessBoard } from '../../Model/ChessBoard';
import { ChessTile } from '../../Model/ChessTile';
import { ChessPiece } from '../../Model/ChessPiece';
import {
  initializeBoard as initBoard,
  getTileColor as getColor,
  isSelected as checkSelected,
  isValidMove as checkValidMove,
  handleTileClick as handleClick,
  getPieceSymbol as getSymbol,
  executeMove,
  calculateValidMoves
} from '../composables/classicChessLogic';
import {
  handleBombDetonation,
  shouldShowBombIndicator,
  findFirstBombOnPath
} from '../composables/bombGameMode';
import { Knight } from '../../Model/Pieces/Knight';

// MakeMove function type
type MakeMoveFunction = (
  board: Ref<ChessTile[][]>,
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurn: Ref<'white' | 'black'>,
  moveMode: string
) => void;

// Props
const props = withDefaults(defineProps<{
  moveMode?: string;
  showBombIndicator?: boolean;
  bombCount?: number;
  makeMove?: MakeMoveFunction;
}>(), {
  moveMode: 'teleport',
  showBombIndicator: false,
  bombCount: 8
});

// State
const chessBoard = ref<ChessBoard | null>(null);
const board = ref<ChessTile[][]>([]);
const selectedTile = ref<ChessTile | null>(null);
const validMoves = ref<[number, number][]>([]);
const currentTurn = ref<'white' | 'black'>('white');

// Lifecycle
onMounted(() => {
  initBoard(chessBoard, board, selectedTile, validMoves, currentTurn, props.bombCount);
});

// Methods
const resetBoard = () => {
  initBoard(chessBoard, board, selectedTile, validMoves, currentTurn, props.bombCount);
};

const getTileColor = (row: number, col: number): string => getColor(row, col);

const isSelected = (row: number, col: number): boolean => 
  checkSelected(selectedTile, row, col);

const isValidMove = (row: number, col: number): boolean => 
  checkValidMove(validMoves, row, col);

const getPieceSymbol = (piece: ChessPiece): string => getSymbol(piece);

const shouldShowBomb = (tile: ChessTile): boolean => 
  shouldShowBombIndicator(tile, props.showBombIndicator);

const handleTileClick = (row: number, col: number) => {
  const rowArr = board.value[row];
  if (!rowArr) return;
  const clickedTile = rowArr[col];
  if (!clickedTile) return;

  // Execute move if valid destination
  if (selectedTile.value && checkValidMove(validMoves, row, col)) {
    // Use custom makeMove function if provided
    if (props.makeMove) {
      props.makeMove(board, selectedTile.value, clickedTile, currentTurn, props.moveMode);
    } else {
      // Default behavior: simple move without game mode logic
      executeMove(selectedTile.value, clickedTile, currentTurn);
    }

    // Force Vue to detect nested changes (bomb state)
    triggerRef(board);

    selectedTile.value = null;
    validMoves.value = [];
    return;
  }

  // Select piece if it belongs to current player
  if (clickedTile.piece && clickedTile.piece.color === currentTurn.value) {
    selectedTile.value = clickedTile;
    validMoves.value = calculateValidMoves(board, clickedTile);
  } else {
    selectedTile.value = null;
    validMoves.value = [];
  }
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

.bomb-indicator.exploded {
  animation: none;
  opacity: 0.6;
  filter: grayscale(50%);
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
