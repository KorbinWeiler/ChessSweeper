<template>
  <v-app>
    <v-app-bar app color="primary" dark>
        <v-toolbar-title>ChessSweeper</v-toolbar-title>
        <v-spacer />
        <v-btn :to="{ path: '/setupgame', query: { game: '0' } }" class="mr-3" text>
          Chesssweeper
        </v-btn>
        <v-btn :to="{ path: '/setupgame', query: { game: '1' } }" class="mr-3" text>
          Chessception
        </v-btn>
        <v-btn :to="{ path: '/setupgame', query: { game: '2' } }" class="mr-3" text>
          Shuffle Chess
        </v-btn>
        <v-btn to="/stats" text>
          View Stats
        </v-btn>
        <v-btn to="/" text>
          Home
        </v-btn>
      </v-app-bar>
    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>
