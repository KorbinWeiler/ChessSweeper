<template>
  <v-container fluid class="pa-2 pa-md-8">
    <v-row align="start" justify="center">
      <v-col cols="12" md="auto" class="d-flex justify-center">
        <v-sheet class="chessboard" elevation="6" rounded="lg" border>
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="d-flex">
            <div
              v-for="(tile, colIndex) in row"
              :key="rowIndex + '-' + colIndex"
              class="chess-tile"
              :title="tile.piece ? (tile.piece.type + ' (' + tile.piece.color + ')') : ''"
              :class="[
                getTileColor(rowIndex, colIndex),
                { 'selected': isSelected(rowIndex, colIndex) },
                { 'valid-move': isValidMove(rowIndex, colIndex) },
                { 'path-tile': isInPath(rowIndex, colIndex) }
              ]"
              @click="handleTileClick(rowIndex, colIndex)"
              @mouseenter="previewPathTo(rowIndex, colIndex)"
              @mouseleave="clearPath()"
            >
              <span v-if="tile.piece" class="chess-piece" :class="'piece-' + tile.piece.color">
                {{ getPieceSymbol(tile.piece) }}
              </span>

              <span v-if="tile.bomb && !tile.bomb.isActive" class="bomb-indicator">💣</span>

              <span v-if="tile.vicinityBombs > 0 && tile.piece && showBombIndicator" class="tile-value">{{ tile.vicinityBombs }}</span>

              <span v-if="isValidMove(rowIndex, colIndex) && !tile.piece" class="move-dot"></span>
            </div>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="auto" class="d-flex justify-center">
        <v-card elevation="4" rounded="lg" min-width="260" class="pa-4">
          <v-card-title class="d-flex align-center ga-3 flex-wrap">
            <v-avatar size="36" :color="currentTurn === 'white' ? 'grey-lighten-4' : 'grey-darken-3'">
              <span class="text-h6">{{ currentTurn === 'white' ? '⚪' : '⚫' }}</span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">{{ currentTurn === 'white' ? 'White' : 'Black' }}'s turn</div>
              <div v-if="gameOver" class="text-error font-weight-bold mt-1">Game Over — {{ winner }} wins</div>
            </div>
            <v-spacer />
            <v-chip size="small" :color="moveMode === 'slide' ? 'blue-lighten-4' : 'green-lighten-4'" variant="tonal">
              {{ moveMode === 'slide' ? 'Slide Mode (Press R)' : 'Teleport Mode' }}
            </v-chip>
          </v-card-title>

          <v-card-actions class="pt-2">
            <v-btn color="primary" size="small" variant="elevated" @click="resetBoard">Reset</v-btn>
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
import axios from 'axios';

const config = useRuntimeConfig();

interface Props {
  moveMode?: string;
  showBombIndicator?: boolean;
  bombCount?: number;
}
const props = defineProps<Props>();
const moveMode = computed(() => props.moveMode ?? 'teleport');
const showBombIndicator = ref(props.showBombIndicator ?? false);
const bombCount = props.bombCount ?? 6;

const chessBoard = ref<ChessBoard | null>(null);
const board = ref<ChessTile[][]>([]);
const selectedTile = ref<ChessTile | null>(null);
const validMoves = ref<[number, number][]>([]);
const path = ref<[number, number][]>([]);
const allPaths = ref<[number, number][][]>([]);
const currentPathIndex = ref<number>(0);
const hoveredDestination = ref<[number, number] | null>(null);
const currentTurn = ref<'white' | 'black'>('white');
const gameOver = ref<boolean>(false);
const winner = ref<'white' | 'black' | null>(null);

onMounted(() => {
  initializeBoard(bombCount);
  window.addEventListener('keydown', handleKeyPress);
});

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'r' || event.key === 'R') {
    cyclePath();
  }
};

const initializeBoard = (bombCount: number) => {
  chessBoard.value = new ChessBoard(bombCount);
  board.value = chessBoard.value.board;
  selectedTile.value = null;
  validMoves.value = [];
  path.value = [];
  currentTurn.value = 'white';
};

const resetBoard = () => {
  initializeBoard(bombCount);
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
  if (gameOver.value) return;
  const rowArr = board.value[row];
  if (!rowArr) return;
  const clickedTile = rowArr[col];
  if (!clickedTile) return;

  // If a tile is already selected and we click on a valid move
  if (selectedTile.value && isValidMove(row, col)) {
    movePiece(selectedTile.value!, clickedTile);
    selectedTile.value = null;
    validMoves.value = [];
    path.value = [];
    return;
  }

  // If clicking on a piece of the current player's color
  if (clickedTile.piece && clickedTile.piece.color === currentTurn.value) {
    selectedTile.value = clickedTile;
    validMoves.value = calculateValidMoves(clickedTile);
    path.value = [];
  } else {
    selectedTile.value = null;
    validMoves.value = [];
    path.value = [];
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

    // Knights can jump over pieces, so no path-check needed
    if (piece instanceof Knight) {
      return !targetTile.piece || targetTile.piece.color !== piece.color;
    }

    // For sliding pieces (rook, bishop, queen) and other multi-step moves,
    // ensure there are no blocking pieces between source and target when
    // using "slide" mode. In "teleport" mode pieces can ignore blockers except pawns.
    const dx = x - tile.x;
    const dy = y - tile.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = Math.sign(dx);
    const stepY = Math.sign(dy);

    if (moveMode.value === 'teleport') {
      // teleport: ignore intermediate blockers except pawns
      // Check intermediate squares for pawns
      for (let s = 1; s < steps; s++) {
        const checkX = tile.x + stepX * s;
        const checkY = tile.y + stepY * s;
        const rowArrCheck = board.value[checkX];
        if (!rowArrCheck) return false;
        const midTile = rowArrCheck[checkY];
        if (!midTile) return false;
        // Pawns block teleportation
        if (midTile.piece instanceof Pawn) return false;
      }
      // Can't land on own piece
      return !targetTile.piece || targetTile.piece.color !== piece.color;
    }

    // slide mode: check intermediate squares (exclude destination)
    for (let s = 1; s < steps; s++) {
      const checkX = tile.x + stepX * s;
      const checkY = tile.y + stepY * s;
      const rowArrCheck = board.value[checkX];
      if (!rowArrCheck) return false;
      const midTile = rowArrCheck[checkY];
      if (!midTile) return false;
      if (midTile.piece) return false; // Blocked by a piece
    }

    // Default: can't move to a tile occupied by own piece
    return !targetTile.piece || targetTile.piece.color !== piece.color;
  });
};

const findAllPaths = (fromX: number, fromY: number, toX: number, toY: number): [number, number][][] => {
  const paths: [number, number][][] = [];
  const dx = toX - fromX;
  const dy = toY - fromY;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) return paths;

  const piece = selectedTile.value?.piece;
  // Knights move in L-shape: show both possible paths
  if (piece instanceof Knight) {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const stepX = Math.sign(dx);
    const stepY = Math.sign(dy);
    
    if (absDx === 2 && absDy === 1) {
      // Path 1: Move 2 horizontally first
      const path1: [number, number][] = [
        [fromX + stepX, fromY],
        [fromX + stepX * 2, fromY],
        [toX, toY]
      ];
      paths.push(path1);
      
      // Path 2: Move 1 vertically, then 2 horizontally
      const path2: [number, number][] = [
        [fromX, fromY + stepY],
        [fromX + stepX, fromY + stepY],
        [toX, toY]
      ];
      paths.push(path2);
    } else if (absDx === 1 && absDy === 2) {
      // Path 1: Move 2 vertically first
      const path1: [number, number][] = [
        [fromX, fromY + stepY],
        [fromX, fromY + stepY * 2],
        [toX, toY]
      ];
      paths.push(path1);
      
      // Path 2: Move 1 horizontally, then 2 vertically
      const path2: [number, number][] = [
        [fromX + stepX, fromY],
        [fromX + stepX, fromY + stepY],
        [toX, toY]
      ];
      paths.push(path2);
    } else {
      paths.push([[toX, toY]]);
    }
    return paths;
  }

  // For other pieces with diagonal/orthogonal movement
  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  
  // Check if this is a diagonal or straight move
  const isDiagonal = Math.abs(dx) === Math.abs(dy) && dx !== 0 && dy !== 0;
  const isStraight = (dx === 0 || dy === 0);
  
  if (isDiagonal || isStraight) {
    // Only one path possible for diagonal/straight moves
    const path1: [number, number][] = [];
    for (let s = 1; s <= steps; s++) {
      const x = fromX + stepX * s;
      const y = fromY + stepY * s;
      if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
      path1.push([x, y]);
    }
    paths.push(path1);
  } else if (dx !== 0 && dy !== 0) {
    // L-shaped move (for pieces that can move like this)
    // Path 1: Horizontal first, then vertical
    const path1: [number, number][] = [];
    for (let s = 1; s <= Math.abs(dx); s++) {
      path1.push([fromX + stepX * s, fromY]);
    }
    for (let s = 1; s <= Math.abs(dy); s++) {
      path1.push([toX, fromY + stepY * s]);
    }
    paths.push(path1);
    
    // Path 2: Vertical first, then horizontal
    const path2: [number, number][] = [];
    for (let s = 1; s <= Math.abs(dy); s++) {
      path2.push([fromX, fromY + stepY * s]);
    }
    for (let s = 1; s <= Math.abs(dx); s++) {
      path2.push([fromX + stepX * s, toY]);
    }
    paths.push(path2);
  }
  
  return paths.length > 0 ? paths : [[[toX, toY]]];
};

const findPaths = (fromX: number, fromY: number, toX: number, toY: number): [number, number][] => {
  const res: [number, number][] = [];
  const dx = toX - fromX;
  const dy = toY - fromY;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) return res;

  const piece = selectedTile.value?.piece;
  // Knights move in L-shape: show the path (2 squares one way, then 1 square perpendicular)
  if (piece instanceof Knight) {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const stepX = Math.sign(dx);
    const stepY = Math.sign(dy);
    
    // Move 2 in the longer direction first, then 1 in the shorter direction
    if (absDx === 2) {
      // Move 2 horizontally
      res.push([fromX + stepX, fromY]);
      res.push([fromX + stepX * 2, fromY]);
      // Then 1 vertically
      res.push([toX, toY]);
    } else if (absDy === 2) {
      // Move 2 vertically
      res.push([fromX, fromY + stepY]);
      res.push([fromX, fromY + stepY * 2]);
      // Then 1 horizontally
      res.push([toX, toY]);
    } else {
      // Fallback: just show destination
      res.push([toX, toY]);
    }
    return res;
  }

  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  
  for (let s = 1; s <= steps; s++) {
    const x = fromX + stepX * s;
    const y = fromY + stepY * s;
    if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
    res.push([x, y]);
  }
  return res;
};

const isInPath = (r: number, c: number): boolean => {
  return path.value.some(([x, y]) => x === r && y === c);
};

const previewPathTo = (toX: number, toY: number) => {
  // Only show path in slide mode
  if (moveMode.value !== 'slide') {
    path.value = [];
    allPaths.value = [];
    hoveredDestination.value = null;
    return;
  }
  if (!selectedTile.value) { 
    path.value = [];
    allPaths.value = [];
    hoveredDestination.value = null;
    return; 
  }
  // Only preview for valid moves
  if (!isValidMove(toX, toY)) { 
    path.value = [];
    allPaths.value = [];
    hoveredDestination.value = null;
    return; 
  }
  const fromX = selectedTile.value.x;
  const fromY = selectedTile.value.y;
  
  // If hovering over a new destination, reset path index
  if (hoveredDestination.value?.[0] !== toX || hoveredDestination.value?.[1] !== toY) {
    currentPathIndex.value = 0;
    hoveredDestination.value = [toX, toY];
  }
  
  allPaths.value = findAllPaths(fromX, fromY, toX, toY);
  if (allPaths.value.length > 0) {
    path.value = allPaths.value[currentPathIndex.value % allPaths.value.length]!;
    console.log(`Path ${currentPathIndex.value + 1}/${allPaths.value.length} from`, [fromX, fromY], 'to', [toX, toY], ':', path.value);
  }
};

const cyclePath = () => {
  if (allPaths.value.length > 1 && hoveredDestination.value) {
    currentPathIndex.value = (currentPathIndex.value + 1) % allPaths.value.length;
    path.value = allPaths.value[currentPathIndex.value]!;
    console.log(`Switched to path ${currentPathIndex.value + 1}/${allPaths.value.length}:`, path.value);
  }
};

const clearPath = () => { 
  path.value = [];
  allPaths.value = [];
  currentPathIndex.value = 0;
  hoveredDestination.value = null;
};

const movePiece = (fromTile: ChessTile, toTile: ChessTile) => {
  if (!fromTile.piece) return;

  const movingPiece = fromTile.piece;
  const capturedPiece = toTile.piece;
  
  // In slide mode, check for bombs along the path
  if (moveMode.value === 'slide' && path.value.length > 0) {
    // Check each tile in the path for bombs
    for (const [pathX, pathY] of path.value) {
      const pathTile = board.value[pathX]?.[pathY];
      if (!pathTile) continue;
      
      if (pathTile.bomb && pathTile.bomb.isActive) {
        // Found a bomb along the path - stop here and explode
        fromTile.piece = null;
        pathTile.piece = movingPiece;
        
        // Mark pawn as moved if applicable
        if (movingPiece instanceof Pawn) {
          (movingPiece as Pawn).hasMoved = true;
        }
        
        const detonated = pathTile.bomb.detonate();
        if (detonated) {
          console.log(`Bomb detonated along path at [${pathX}, ${pathY}]!`);
          axios.post(`${config.public.SERVER_URL}/newExplosion`, {
            timestamp: new Date().toISOString(),
            pieceType: movingPiece.type,
            color: movingPiece.color
          }).catch(error => {
            console.error('Failed to send explosion data:', error);
          });
          chessBoard.value?.FindBombs();
          
          // If the exploded piece was a King, end the game
          if (movingPiece instanceof King) {
            gameOver.value = true;
            winner.value = movingPiece.color === 'white' ? 'black' : 'white';
          }
          
          // Remove the piece from the bomb tile
          pathTile.piece = null;
        }
        
        // Switch turns and return early
        if (!gameOver.value) {
          currentTurn.value = currentTurn.value === 'white' ? 'black' : 'white';
        }
        return;
      }
    }
  }

  // Normal move - no bombs encountered along path
  toTile.piece = movingPiece;
  fromTile.piece = null;
  
  // If the moved piece is a pawn, mark it as having moved
  if (toTile.piece instanceof Pawn) {
    (toTile.piece as Pawn).hasMoved = true;
  }
  
  // Check if there's a bomb at destination
  if (toTile.bomb) {
    const detonated = toTile.bomb.detonate();
    if (detonated) {
      const explodedPiece = toTile.piece;
      console.log(`Bomb detonated at destination ${explodedPiece ? explodedPiece.type : 'unknown piece'}!`);
      axios.post(`${config.public.SERVER_URL}/newExplosion`, {
        timestamp: new Date().toISOString(),
        pieceType: explodedPiece ? explodedPiece.type : null,
        color: explodedPiece ? explodedPiece.color : null
      }).catch(error => {
        console.error('Failed to send explosion data:', error);
      });
      chessBoard.value?.FindBombs();
      // If the exploded piece was a King, end the game
      if (explodedPiece instanceof King) {
        gameOver.value = true;
        winner.value = explodedPiece.color === 'white' ? 'black' : 'white';
      }
      //remove piece from toTile
      toTile.piece = null;
    }
  }

  // If we captured a piece via a normal move, check for king capture
  if (capturedPiece && capturedPiece instanceof King) {
    gameOver.value = true;
    // winner is the color of the mover
    winner.value = toTile.piece ? toTile.piece.color : null;
  }
  
  // Switch turns only if game not over
  if (!gameOver.value) {
    currentTurn.value = currentTurn.value === 'white' ? 'black' : 'white';
  }
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
/* ── Board & Tile grid (not achievable with Vuetify alone) ── */
.chessboard {
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
}

.chess-tile {
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: background-color 0.15s ease, filter 0.15s ease;
  flex-shrink: 0;
}

.chess-tile:hover { filter: brightness(0.9); }

/* ── Tile colours ── */
.light-tile { background-color: #f0d9b5; }
.dark-tile  { background-color: #b58863; }

.chess-tile.selected    { background-color: #7fc97f !important; box-shadow: inset 0 0 0 3px #4a9d4a; }
.chess-tile.valid-move  { background-color: #a8e6cf !important; }
.chess-tile.path-tile   { background: rgba(99,179,237,.45) !important; box-shadow: inset 0 0 0 3px rgba(99,179,237,.8) !important; }

/* ── Chess pieces ── */
.chess-piece {
  font-size: 36px;
  user-select: none;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.chess-piece:hover { transform: scale(1.1); }

.piece-white { filter: drop-shadow(2px 2px 2px rgba(0,0,0,.3)); }
.piece-black { filter: drop-shadow(2px 2px 2px rgba(255,255,255,.2)); }

/* ── Overlays (bomb indicator, value badge, move dot) ── */
.bomb-indicator {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 14px;
  color: #e53e3e;
}

.tile-value {
  position: absolute;
  bottom: 3px;
  left: 3px;
  background: rgba(0,0,0,.55);
  color: #fff;
  font-size: 11px;
  padding: 1px 3px;
  border-radius: 4px;
  line-height: 1;
}

:root .v-theme--dark .tile-value {
  background: rgba(255,255,255,.55);
  color: #000;
}

.move-dot {
  width: 14px;
  height: 14px;
  background-color: rgba(127,201,127,.6);
  border-radius: 50%;
  pointer-events: none;
}

/* ── Responsive tile sizes ── */
@media (max-width: 1024px) {
  .chess-tile  { width: 90px; height: 90px; }
  .chess-piece { font-size: 30px; }
}
@media (max-width: 768px) {
  .chess-tile  { width: 35px; height: 35px; }
  .chess-piece { font-size: 22px; }
  .bomb-indicator { font-size: 9px; top: 1px; right: 1px; }
  .tile-value { font-size: 7px; bottom: 1px; left: 1px; padding: 1px 2px; }
  .move-dot   { width: 9px; height: 9px; }
}
@media (max-width: 480px) {
  .chess-tile  { width: 32px; height: 32px; }
  .chess-piece { font-size: 20px; }
  .bomb-indicator { font-size: 8px; }
  .tile-value { font-size: 6px; }
  .move-dot   { width: 7px; height: 7px; }
}
@media (max-width: 430px) {
  .chess-tile  { width: 50px; height: 50px; }
  .chess-piece { font-size: 18px; }
  .bomb-indicator { font-size: 7px; }
  .tile-value { font-size: 6px; padding: 0 1px; }
  .move-dot   { width: 6px; height: 6px; }
}
@media (max-width: 400px) {
  .chess-tile  { width: 28px; height: 28px; }
  .chess-piece { font-size: 17px; }
}
</style>
