<template>
  <v-app>
    <v-app-bar app color="primary" dark>
        <v-toolbar-title>ChessSweeper</v-toolbar-title>
        <v-spacer />
        <v-btn to="/setupgame" class="mr-3" text>
          Start a new Game
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
