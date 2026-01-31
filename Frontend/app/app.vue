<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My Nuxt App</v-toolbar-title>
      <NuxtLink to="/" class="ml-5 mr-3" exact>
        Home
      </NuxtLink>
    </v-app-bar>
    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>
