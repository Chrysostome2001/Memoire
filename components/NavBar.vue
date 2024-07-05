<template>
    <nav>
        <!--Toolbar-->
      <v-toolbar flat app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  
        <v-toolbar-title class="text--uppercase grey--text">
            <span class="font-weight-light">E-</span>
            <span>Note</span>
        </v-toolbar-title>
  
        <v-spacer></v-spacer>
  
        <v-btn flat color="bg-grey">
          <span>Log Out</span>
          <v-icon right>mdi-export</v-icon>
        </v-btn>
      </v-toolbar>

      <!--Navigationbar-->
      <v-navigation-drawer app v-model="drawer" color="bg-success">
        <p>test</p>
      </v-navigation-drawer>
    </nav>
    
  </template>

<script setup lang="ts">
    const drawer = ref(false);
</script>