<template>
    <v-form>
        <v-radio-group class="setup-radios" v-model="radios">
            <v-radio label="Shuffle by Piece Type" value="group" />
            <v-radio label="Shuffle by Individual Piece" value="slide" />
        </v-radio-group>
        <v-btn @click="startGame" color="primary" large>
            start game
        </v-btn>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const radios = ref("group");

function startGame() {
    router.push({
        path: '/game',
        query: {
            moveMode: 'teleport',
            showBombIndicator: 'false',
            bombCount: 0,
            gameMode: 2
        }
    });
}
</script>