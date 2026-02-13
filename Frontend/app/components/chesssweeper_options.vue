<template>
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
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showBomb = ref(false);
const radios = ref('teleport');
const bombCount = ref(6);

function startGame() {
    router.push({
        path: '/game',
        query: {
            moveMode: radios.value,
            showBombIndicator: showBomb.value ? 'true' : 'false',
            bombCount: Math.floor(bombCount.value),
            gameMode: 0
        }
    });
}
</script>