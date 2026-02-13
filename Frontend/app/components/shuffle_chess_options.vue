<template>
    <v-form>
        <v-radio-group class="setup-radios" v-model="radios">
            <v-radio label="Shuffle by Piece Type" value="group" />
            <v-radio label="Shuffle by Individual Piece" value="slide" />
        </v-radio-group>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';

const radios = ref("group");
</script>