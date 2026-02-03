<template>
  <v-app>
    <div class="page-container">
      <h1>Game</h1>
      <Chessboard :moveMode="moveMode" :showBombIndicator="showBombIndicator" />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import Chessboard from '../components/chessboard.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const moveMode = route.query.moveMode ? String(route.query.moveMode) : 'teleport';
const showBombIndicator = route.query.showBombIndicator ? String(route.query.showBombIndicator) === 'true' : false;
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}
</style>
