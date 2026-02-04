<template>
  <v-app>
    <div class="page-container">
      <h1>Game</h1>
      <Chessboard :moveMode="moveMode" :showBombIndicator="showBombIndicator" :bombCount="bombCount" />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import Chessboard from '../components/chessboard.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const moveMode = route.query.moveMode ? String(route.query.moveMode) : 'teleport';
const showBombIndicator = route.query.showBombIndicator ? String(route.query.showBombIndicator) === 'true' : false;
const bombCount = route.query.bombCount ? Number(route.query.bombCount) : 6;
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}
</style>
