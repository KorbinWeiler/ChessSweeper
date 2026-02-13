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

<script>
// import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            showBomb: false,
            radios: 'teleport',
            bombCount: 6
        }
    },
    methods: {
        startGame() {
            router.push({ 
                path: '/game', 
                query: { 
                moveMode: this.radios,
                showBombIndicator: this.showBomb ? 'true' : 'false', 
                bombCount: Math.floor(this.bombCount) 
                } 
            })
        }
    }
}
</script>