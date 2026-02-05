<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-row justify="center">
      <v-col cols="auto">
        <div class="text-h4 text-md-h3 font-weight-bold text-center mb-4">Game</div>
        <Chessboard :moveMode="moveMode" :showBombIndicator="showBombIndicator" :bombCount="bombCount" />
      </v-col>
    </v-row>
  </v-container>
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
/* All styling handled by Vuetify components and utility classes */
</style>
