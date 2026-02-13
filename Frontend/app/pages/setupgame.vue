<template>
  <v-container class="pa-5" fluid fill-height>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="auto" class="text-center">
        <v-form>
            <v-switch v-model="showBomb" label="Show Bomb Indicator"></v-switch>
            <v-radio-group class="setup-radios" v-model="radios">
                <v-radio label="Pieces Teleport" value="teleport" />
                <v-radio label="Pieces Slide" value="slide" />
            </v-radio-group>
            <v-label>Number of Bombs: {{ Math.floor(bombCount) }}</v-label>
            <v-slider v-model="bombCount" :min="6" :max="14">
            </v-slider>
            <v-btn @click="startGame" color="primary" large>
                start game
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const radios = ref('teleport')
const showBomb = ref(false)
const bombCount = ref(6)
const router = useRouter()
const startGame = () => {
  router.push({ 
    path: '/game', 
    query: { 
      moveMode: radios.value, 
      showBombIndicator: showBomb.value ? 'true' : 'false', 
      bombCount: Math.floor(bombCount.value) 
    } 
  })
}
</script>

<style scoped>
.setup-radios input[type="radio"] {
  -webkit-appearance: radio;
  appearance: auto;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .v-form {
    width: 100%;
    max-width: 350px;
    padding: 0 1rem;
  }
}
</style>