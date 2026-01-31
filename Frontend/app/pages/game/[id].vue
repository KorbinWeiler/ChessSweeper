<template>
  <v-app>
    <div class="page-container">
      <h1>Game</h1>
      <Chessboard />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import Chessboard from '../../components/chessboard.vue';
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}
</style>