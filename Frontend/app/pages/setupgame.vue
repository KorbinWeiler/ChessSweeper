<template>
  <v-container fluid class="fill-height pa-4">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="4" class="pa-6 rounded-lg">
          <v-card-title class="text-h5 font-weight-bold text-center mb-2">Game Setup</v-card-title>
          <v-card-text>
            <v-form>
              <v-switch v-model="showBomb" label="Show Bomb Indicator" color="primary" hide-details class="mb-4" />

              <v-radio-group v-model="radios" label="Movement Mode" class="mb-4">
                <v-radio label="Pieces Teleport" value="teleport" color="primary" />
                <v-radio label="Pieces Slide" value="slide" color="primary" />
              </v-radio-group>

              <v-label class="mb-1 d-block">Number of Bombs: {{ Math.floor(bombCount) }}</v-label>
              <v-slider v-model="bombCount" :min="6" :max="14" color="primary" thumb-label class="mb-6" />

              <v-btn @click="startGame" color="primary" size="large" block variant="elevated">Start Game</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'

const radios = ref('teleport')
const showBomb = ref(false)
const bombCount = ref(6)
const router = useRouter()
const startGame = () => router.push({ path: '/game', query: { moveMode: radios.value, showBombIndicator: showBomb.value ? 'true' : 'false', bombCount: Math.floor(bombCount.value) } })
</script>

<style scoped>
/* All styling handled by Vuetify components and utility classes */
</style>