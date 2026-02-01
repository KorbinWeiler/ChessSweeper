<template>
    <v-app>
        <v-card 
        class="mx-auto"
        subtitle="Global Game Statistics"
        width="400">
            <v-row align="center" justify="center" class="fill-height">
                <v-col cols="auto" class="text-center content">
                    <p>Total Explosions: {{ data.totalExplosions }}</p>
                    <p>White Pieces Explosioned: {{ data.whiteExplosions }}</p>
                    <p>Black Pieces Explosioned: {{ data.blackExplosions }}</p>
                    <h3>Explosions by Piece Type:</h3>
                    <v-list>
                        <v-list-item v-for="item in data.numberExplodedByPiece" :key="item.pieceType">
                            <v-list-item-content>
                                <v-list-item-title>{{ item.pieceType }}: {{ item.count }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
    </v-card>
    </v-app>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const config = useRuntimeConfig();

const data = ref({
  totalExplosions: 0,
  whiteExplosions: 0,
  blackExplosions: 0,
  numberExplodedByPiece: []
});

try {
  const response = await axios.get(`${config.public.SERVER_URL}/stats`);
  data.value = response.data;
} catch (error) {
  console.error('Error fetching stats:', error);
}
</script>