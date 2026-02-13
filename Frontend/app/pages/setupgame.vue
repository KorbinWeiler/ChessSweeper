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
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import chesssweeper_options from '../components/chesssweeper_options.vue';
import Chessception from '~/components/chessception_options.vue';
import shuffle_chess_options from '~/components/shuffle_chess_options.vue';

const props = defineProps({
  game: {
    type: Number,
    required: false
  }
});

const route = useRoute();
const preset = route.query.preset ? Number(route.query.preset) : undefined;
const initialGame = (route.query.game ? Number(route.query.game) : 0) || props.game || 0;

const toggle_exlusive = ref(initialGame);
const options =  [chesssweeper_options, Chessception, shuffle_chess_options]

// Watch for route changes and update toggle_exlusive
watch(() => route.query.game, (newGame) => {
  if (newGame !== undefined) {
    toggle_exlusive.value = Number(newGame);
  }
});
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