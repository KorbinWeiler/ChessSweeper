<template>
  <v-container class="pa-5" fluid fill-height>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="auto" class="text-center">
        <v-btn-toggle v-model="toggle_exlusive">
          <v-btn value=0>Chesssweeper</v-btn>
          <v-btn value=1>Chessception</v-btn>
          <v-btn value=2>Shuffle Chess</v-btn>
        </v-btn-toggle>
        <component :is="options[toggle_exlusive]"></component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import chesssweeper_options from '../components/chesssweeper_options.vue';
import Chessception from '~/components/chessception.vue';
import shuffle_chess_options from '~/components/shuffle_chess_options.vue';
const toggle_exlusive = ref(0);
const options =  [chesssweeper_options, Chessception, shuffle_chess_options]
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