<template>
    <v-form>
        <p>Dimensions: {{ Math.floor(dimensions) }}</p>
        <v-slider v-model="dimensions" :min="1" :max="3" label="Dimensions">
        </v-slider>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';

const dimensions = ref(1);
</script>