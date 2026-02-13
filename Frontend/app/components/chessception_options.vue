<template>
    <v-form>
        <p>Dimensions: {{ Math.floor(dimensions) }}</p>
        <v-slider v-model="dimensions" :min="1" :max="3" label="Dimensions">
        </v-slider>
        <v-btn @click="startGame" color="primary" large>
            start game
        </v-btn>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dimensions = ref(1);

function startGame() {
    router.push({
        path: '/chessception',
        query: {
            dimensions: Math.floor(dimensions.value),
            moveMode: 'teleport',
            showBombIndicator: 'false',
            bombCount: 0,
            gameMode: 1
        }
    });
}
</script>