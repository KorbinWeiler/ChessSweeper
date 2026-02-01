<template>
  <v-app>
    <v-container class="pa-5" fluid fill-height>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="auto" class="text-center">
          <v-form>
            <v-switch label="Show Bomb Indicator"></v-switch>
            <v-radio-group class="setup-radios" v-model="radios">
                <v-radio label="Pieces Teleport" value="teleport" />
                <v-radio label="Pieces Slide" value="slide" />
            </v-radio-group>
            <p>Radios {{ radios }}</p>
            <v-btn @click="startGame" color="primary" large>
                start game
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const radios = ref('teleport')
const router = useRouter()
const startGame = () => router.push('/game')
</script>

<style scoped>
.setup-radios input[type="radio"] {
  -webkit-appearance: radio;
  appearance: auto;
  pointer-events: auto;
}
</style>