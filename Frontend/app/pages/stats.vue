<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="4" class="rounded-lg">
          <v-card-title class="text-h5 font-weight-bold">Global Game Statistics</v-card-title>
          <v-card-text>
            <v-table density="comfortable" class="mb-4">
              <tbody>
                <tr>
                  <td class="font-weight-medium">Total Explosions</td>
                  <td class="text-right">{{ data.totalExplosions }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">White Pieces Exploded</td>
                  <td class="text-right">{{ data.whiteExplosions }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Black Pieces Exploded</td>
                  <td class="text-right">{{ data.blackExplosions }}</td>
                </tr>
              </tbody>
            </v-table>

            <div class="text-subtitle-1 font-weight-bold mb-2">Explosions by Piece Type</div>
            <v-list density="compact" rounded>
              <v-list-item v-for="item in data.numberExplodedByPiece" :key="item.pieceType">
                <v-list-item-title>{{ item.pieceType }}</v-list-item-title>
                <template #append>
                  <v-chip size="small" color="error" variant="tonal">{{ item.count }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

<style scoped>
/* All styling handled by Vuetify components and utility classes */
</style>