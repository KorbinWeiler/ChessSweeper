<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="4">
      <v-toolbar-title class="font-weight-bold">♟ ChessSweeper</v-toolbar-title>
      <v-spacer />
      <v-btn to="/" variant="text" class="text-none">Home</v-btn>
      <v-btn to="/setupgame" variant="text" class="text-none">Play</v-btn>
      <v-btn to="/stats" variant="text" class="text-none">Stats</v-btn>
      <v-btn :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" variant="text" @click="toggleTheme" />
    </v-app-bar>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { computed } from 'vue';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
};
</script>
