<template>
  <div class="page-container">
    <h1>Game</h1>
    <Chessboard 
      :moveMode="moveMode" 
      :showBombIndicator="showBombIndicator" 
      :bombCount="bombCount"
      :makeMove="makeMove" />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import Chessboard from '../components/chessboard.vue';
import { useRoute } from 'vue-router';
import { chesssweeperMakeMove, chessceptionMakeMove, shuffleChessMakeMove } from '../composables/gameModes';
import type { ChessTile } from '../../Model/ChessTile';

type MakeMoveFunction = (
  board: Ref<ChessTile[][]>,
  fromTile: ChessTile,
  toTile: ChessTile,
  currentTurn: Ref<'white' | 'black'>,
  moveMode: string
) => void;

const route = useRoute();
const moveMode = route.query.moveMode ? String(route.query.moveMode) : 'teleport';
const showBombIndicator = route.query.showBombIndicator ? String(route.query.showBombIndicator) === 'true' : false;
const bombCount = route.query.bombCount ? Number(route.query.bombCount) : 6;
const gameMode = route.query.gameMode ? Number(route.query.gameMode) : 0;

// Map game mode to makeMove function
const makeMoveMap: MakeMoveFunction[] = [
  chesssweeperMakeMove,
  chessceptionMakeMove,
  shuffleChessMakeMove
];

const makeMove = makeMoveMap[gameMode] || chesssweeperMakeMove;
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

@media (max-width: 768px) {
  .page-container {
    padding-top: 0.5rem;
  }
  .page-container h1 {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }
}
</style>
