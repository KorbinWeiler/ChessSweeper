<template>
    <h1>Dimension: {{ dimension }}</h1>
    <Game :makeMove="chessceptionMakeMove" />
    
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Game from './game.vue';
import { chessceptionMakeMove } from '../composables/gameModes';
import { ChessBoard } from '~~/Model/ChessBoard';

const route = useRoute();
const dimensions = ref(route.query.dimensions ? Number(route.query.dimensions) : 1);
const dimensionArray = ref([]);

for (let i = 0; i < dimensions.value; i++) {
    dimensionArray.value.push(new ChessBoard(0));
}

const dimension = ref(0);
</script>